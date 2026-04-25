// Supabase Edge Function: generate-persona
// サーバー側のAnthropic APIキーを使ってAIペルソナルーティンを生成する
//
// デプロイ:
//   supabase functions deploy generate-persona
//   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
//
// テスト:
//   curl -X POST <SUPABASE_URL>/functions/v1/generate-persona \
//     -H "Authorization: Bearer <USER_JWT>" \
//     -H "Content-Type: application/json" \
//     -d '{"prompt": "ミニマリストのデザイナー"}'

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface GenerateRequest {
  prompt: string;
}

const SYSTEM_PROMPT = `あなたはライフスタイルデザイナーです。与えられたペルソナの説明に基づいて、その人物の理想的な一日のルーティンを設計してください。

以下のJSON形式で、4〜6個のタスクを返してください。他のテキストは一切含めず、JSONのみ返してください。

{
  "name": "ペルソナ名（日本語、短く）",
  "title": "キャッチコピー（日本語、10文字以内）",
  "routine": [
    {
      "time": "HH:MM",
      "endTime": "HH:MM",
      "title": "タスク名（日本語、短く、例: 朝の瞑想）",
      "thought": "このタスクの哲学や意味（日本語、1-2文）",
      "type": "nature|mind|work"
    }
  ]
}

typeの定義:
- "nature": 身体活動、散歩、運動、食事、自然との関わり
- "mind": 瞑想、読書、日記、内省、学習
- "work": 仕事、創作、生産的活動

重要:
- タスク名は必ず日本語にしてください（英語不可）
- タスクは早朝から夜までの時間順で並べてください
- 日本の生活文化に合った内容にしてください`;

// 1ユーザーあたり1日10回まで
const DAILY_LIMIT = 10;

async function checkRateLimit(
  supabase: ReturnType<typeof createClient>,
  userId: string
): Promise<boolean> {
  // user_settingsにai_generate_countとai_generate_dateを使う
  const { data } = await supabase
    .from("user_settings")
    .select("ai_generate_count, ai_generate_date")
    .eq("user_id", userId)
    .single();

  const today = new Date().toISOString().slice(0, 10);

  if (!data || data.ai_generate_date !== today) {
    // 新しい日 or レコードなし → カウンターリセット
    await supabase
      .from("user_settings")
      .upsert(
        {
          user_id: userId,
          ai_generate_count: 1,
          ai_generate_date: today,
        },
        { onConflict: "user_id" }
      );
    return true;
  }

  if ((data.ai_generate_count ?? 0) >= DAILY_LIMIT) {
    return false;
  }

  // カウンター増加
  await supabase
    .from("user_settings")
    .update({ ai_generate_count: (data.ai_generate_count ?? 0) + 1 })
    .eq("user_id", userId);

  return true;
}

Deno.serve(async (req: Request) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // サーバー側APIキー取得
    const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!anthropicKey) {
      return new Response(
        JSON.stringify({ error: "AI機能は現在準備中です" }),
        {
          status: 503,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 認証
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "ログインが必要です" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "認証エラー" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // リクエストボディ
    const { prompt } = (await req.json()) as GenerateRequest;
    if (!prompt || prompt.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "プロンプトを入力してください" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (prompt.length > 200) {
      return new Response(
        JSON.stringify({ error: "プロンプトは200文字以内にしてください" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // レートリミットチェック
    const allowed = await checkRateLimit(supabase, user.id);
    if (!allowed) {
      return new Response(
        JSON.stringify({
          error: `1日あたりの生成上限（${DAILY_LIMIT}回）に達しました。明日また試してください。`,
        }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Anthropic API呼び出し
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: `以下のペルソナのルーティンを生成してください: ${prompt}`,
          },
        ],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Anthropic API error:", res.status, err);
      return new Response(
        JSON.stringify({ error: "AI生成に失敗しました。しばらく経ってから再試行してください。" }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = await res.json();
    const rawResponse = data.content[0].text;

    // JSONパース
    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Failed to parse AI response:", rawResponse);
      return new Response(
        JSON.stringify({ error: "AIの応答を解析できませんでした" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const persona = JSON.parse(jsonMatch[0]);

    if (
      !persona.name ||
      !persona.routine ||
      !Array.isArray(persona.routine) ||
      persona.routine.length === 0
    ) {
      console.error("Invalid persona format:", persona);
      return new Response(
        JSON.stringify({ error: "AIが正しいフォーマットで応答しませんでした" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // ランダムな色を付与
    const colors = [
      "bg-rose-100 text-rose-800",
      "bg-sky-100 text-sky-800",
      "bg-emerald-100 text-emerald-800",
      "bg-violet-100 text-violet-800",
      "bg-amber-100 text-amber-800",
      "bg-pink-100 text-pink-800",
      "bg-cyan-100 text-cyan-800",
      "bg-indigo-100 text-indigo-800",
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];

    return new Response(
      JSON.stringify({
        id: `ai-${Date.now()}`,
        name: persona.name,
        title: persona.title || prompt,
        color,
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
      JSON.stringify({
        error:
          err instanceof Error ? err.message : "予期しないエラーが発生しました",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
