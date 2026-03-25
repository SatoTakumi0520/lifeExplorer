// Supabase Edge Function: generate-persona
// ユーザーのAPIキーを使ってLLMにペルソナルーティンを生成させるプロキシ
//
// デプロイ: supabase functions deploy generate-persona
// テスト:  curl -X POST <SUPABASE_URL>/functions/v1/generate-persona \
//            -H "Authorization: Bearer <USER_JWT>" \
//            -H "Content-Type: application/json" \
//            -d '{"prompt": "ミニマリストのデザイナー"}'

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RoutineTask {
  time: string;
  endTime?: string;
  title: string;
  thought: string;
  type: "nature" | "mind" | "work";
}

interface GenerateRequest {
  prompt: string; // ペルソナの説明（例: "ミニマリストのデザイナー"）
}

const SYSTEM_PROMPT = `あなたはライフスタイルデザイナーです。与えられたペルソナの説明に基づいて、その人物の理想的な一日のルーティンを設計してください。

以下のJSON形式で、4〜6個のタスクを返してください。他のテキストは一切含めず、JSONのみ返してください。

{
  "name": "ペルソナ名（短く）",
  "title": "キャッチコピー（日本語、10文字以内）",
  "routine": [
    {
      "time": "HH:MM",
      "endTime": "HH:MM",
      "title": "タスク名（英語または日本語、短く）",
      "thought": "このタスクの哲学や意味（日本語、1-2文）",
      "type": "nature|mind|work"
    }
  ]
}

typeの定義:
- "nature": 身体活動、散歩、運動、食事、自然との関わり
- "mind": 瞑想、読書、日記、内省、学習
- "work": 仕事、創作、生産的活動

タスクは早朝から夜までの時間順で並べてください。`;

async function callAnthropic(apiKey: string, prompt: string): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: `以下のペルソナのルーティンを生成してください: ${prompt}` }],
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic API error (${res.status}): ${err}`);
  }
  const data = await res.json();
  return data.content[0].text;
}

async function callOpenAI(apiKey: string, prompt: string): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      max_tokens: 1024,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `以下のペルソナのルーティンを生成してください: ${prompt}` },
      ],
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI API error (${res.status}): ${err}`);
  }
  const data = await res.json();
  return data.choices[0].message.content;
}

Deno.serve(async (req: Request) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 認証: JWTからユーザーIDを取得
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // リクエストボディ解析
    const { prompt } = (await req.json()) as GenerateRequest;
    if (!prompt || prompt.trim().length === 0) {
      return new Response(JSON.stringify({ error: "prompt is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ユーザーのAPIキーと設定を取得
    const { data: settings } = await supabase
      .from("user_settings")
      .select("ai_provider, ai_api_key_encrypted")
      .eq("user_id", user.id)
      .single();

    if (!settings?.ai_api_key_encrypted) {
      return new Response(JSON.stringify({ error: "API key not configured. Please set your API key in Settings." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const provider = settings.ai_provider || "anthropic";
    const apiKey = settings.ai_api_key_encrypted; // Phase 1ではプレーンテキスト保存、Phase 2で暗号化

    // LLM呼び出し
    let rawResponse: string;
    if (provider === "openai") {
      rawResponse = await callOpenAI(apiKey, prompt);
    } else {
      rawResponse = await callAnthropic(apiKey, prompt);
    }

    // JSONパース（LLMの応答からJSONを抽出）
    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return new Response(JSON.stringify({ error: "Failed to parse AI response", raw: rawResponse }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const persona = JSON.parse(jsonMatch[0]);

    // バリデーション
    if (!persona.name || !persona.routine || !Array.isArray(persona.routine)) {
      return new Response(JSON.stringify({ error: "Invalid persona format from AI", raw: rawResponse }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ai_personasテーブルに保存
    const { data: saved, error: saveError } = await supabase
      .from("ai_personas")
      .insert({
        user_id: user.id,
        name: persona.name,
        description: prompt,
        category: "custom",
        routine: persona.routine,
      })
      .select()
      .single();

    if (saveError) {
      console.error("Save error:", saveError);
    }

    return new Response(
      JSON.stringify({
        id: saved?.id,
        name: persona.name,
        title: persona.title || prompt,
        color: "bg-stone-100 text-stone-800",
        category: "custom",
        routine: persona.routine,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
