import { supabase } from './supabase';
import type { PersonaTemplate, RoutineTask } from './types';

const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

// デモモード用: ランダムなモックペルソナを生成
const MOCK_TASKS: Record<string, RoutineTask[]> = {
  default: [
    { time: '06:00', endTime: '06:30', title: '朝の儀式', thought: 'AIが提案した朝の儀式。一日の始まりを丁寧に。', type: 'mind' },
    { time: '07:00', endTime: '08:00', title: '朝の運動', thought: '身体を動かすことで頭が冴える。種類は問わない。', type: 'nature' },
    { time: '09:00', endTime: '12:00', title: '集中ワーク', thought: '最も集中力が高い時間帯を最重要タスクに充てる。', type: 'work' },
    { time: '15:00', endTime: '16:00', title: '創造的な休憩', thought: '午後のスランプを創造的な活動で乗り越える。', type: 'mind' },
    { time: '19:00', endTime: '19:30', title: '一日の振り返り', thought: '今日学んだことを振り返り、明日への準備をする。', type: 'mind' },
  ],
};

function generateMockPersona(prompt: string): PersonaTemplate {
  // プロンプトの内容に基づいて簡易的なペルソナを生成
  const colors = [
    'bg-rose-100 text-rose-800',
    'bg-sky-100 text-sky-800',
    'bg-emerald-100 text-emerald-800',
    'bg-violet-100 text-violet-800',
    'bg-amber-100 text-amber-800',
  ];
  const color = colors[Math.floor(Math.random() * colors.length)];

  return {
    id: `ai-${Date.now()}`,
    name: prompt.slice(0, 20),
    title: `${prompt.slice(0, 15)}のルーティン`,
    color,
    category: 'custom',
    routine: MOCK_TASKS.default,
  };
}

export type GeneratePersonaResult = {
  success: boolean;
  persona?: PersonaTemplate;
  error?: string;
};

/**
 * AIペルソナを生成する
 * - デモモード: モックデータを即座に返す
 * - 本番: Supabase Edge Function経由でLLMを呼び出す
 */
export async function generatePersona(prompt: string): Promise<GeneratePersonaResult> {
  // デモモード: モック応答
  if (IS_DEMO) {
    // 少し遅延を入れてローディング体験をシミュレート
    await new Promise((r) => setTimeout(r, 1500));
    return {
      success: true,
      persona: generateMockPersona(prompt),
    };
  }

  // 本番: Edge Function呼び出し
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return { success: false, error: 'ログインが必要です' };
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-persona`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ prompt }),
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Unknown error' }));
      return { success: false, error: err.error || `HTTP ${res.status}` };
    }

    const persona = await res.json();
    return {
      success: true,
      persona: {
        id: persona.id || `ai-${Date.now()}`,
        name: persona.name,
        title: persona.title,
        color: persona.color || 'bg-stone-100 text-stone-800',
        category: 'custom',
        routine: persona.routine,
      },
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'AIペルソナの生成に失敗しました',
    };
  }
}
