"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Leaf, Sun, Calendar, Search, Plus, ArrowRight, 
  Clock, Coffee, ChevronRight, ChevronLeft, MoreHorizontal, 
  Edit3, User, BookOpen, X, Settings, Award, Sprout, LogIn
} from 'lucide-react';

// --- Supabase Client ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- Types ---
type Screen = 'TOP' | 'HOME' | 'EDIT' | 'SOCIAL' | 'OTHER_HOME' | 'PROFILE' | 'BORROW' | 'SETTINGS';

// --- Utilities ---
const formatDate = (date: Date) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return {
    dow: days[date.getDay()],
    month: months[date.getMonth()],
    day: date.getDate(),
    full: `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`,
    iso: date.toISOString().split('T')[0]
  };
};

const getTaskDurationMinutes = (startTime: string, endTime?: string): number => {
  if (!endTime) return 30;
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;
  return Math.max(endMinutes - startMinutes, 15);
};

const getTaskHeight = (durationMinutes: number): number => {
  const PIXELS_PER_HOUR = 80;
  const MIN_TASK_HEIGHT = 56;
  const height = (durationMinutes / 60) * PIXELS_PER_HOUR;
  return Math.max(height, MIN_TASK_HEIGHT);
};

const timeToMinutes = (time: string): number => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

// --- Mock Data (Base) ---
const INITIAL_TEMPLATES = [
  { id: 1, name: 'Steve Jobs', title: '禅と創造性', color: 'bg-stone-800 text-white', routine: [
    { time: '05:00', title: 'Mirror Question', thought: '「もし今日が人生最後の日だとしたら、今日やろうとしていることをやりたいか？」と鏡の前で自問する。', type: 'mind' },
    { time: '06:00', title: 'Zen Meditation', thought: '禅の瞑想で心を空にする。複雑さを削ぎ落とし、本質だけを残す練習。', type: 'mind' },
    { time: '07:00', title: 'Walk & Think', thought: '裸足で庭を歩きながら、今日最も重要な一つの決断について考える。', type: 'nature' },
    { time: '09:00', title: 'Design Review', thought: '製品の細部を徹底的にレビュー。「これは本当に必要か？」を繰り返し問う。', type: 'work' },
  ]},
  { id: 2, name: 'Haruki M.', title: '走る小説家', color: 'bg-orange-100 text-orange-800', routine: [
    { time: '04:00', title: 'Early Writing', thought: '朝4時に起きて、まだ世界が静かなうちに原稿に向かう。5〜6時間、ただ書く。', type: 'work' },
    { time: '10:00', title: 'Running', thought: '10kmのランニング。走っている間は何も考えない。身体が勝手に走る状態を目指す。', type: 'nature' },
    { time: '12:00', title: 'Music Time', thought: 'レコードを聴きながら昼食。音楽は言葉を超えた物語を教えてくれる。', type: 'mind' },
    { time: '21:00', title: 'Early Sleep', thought: '夜9時には就寝。規則正しい生活こそが長編小説を書き続ける秘訣。', type: 'mind' },
  ]},
  { id: 3, name: 'Elon Musk', title: '5分刻みの超集中', color: 'bg-blue-100 text-blue-800', routine: [
    { time: '06:00', title: 'Skip Breakfast', thought: '朝食は取らない。時間の節約と集中力の維持のため。コーヒーだけで十分。', type: 'work' },
    { time: '07:00', title: 'Email Blitz', thought: '30分でメールを処理。重要度で瞬時に判断し、返信は簡潔に。', type: 'work' },
    { time: '08:00', title: 'Engineering Deep Dive', thought: '最も困難な技術的課題に取り組む。5分単位でスケジュールを区切り、集中を維持。', type: 'work' },
    { time: '22:00', title: 'Reading', thought: '就寝前の読書。SF小説や物理学の本から未来のアイデアを得る。', type: 'mind' },
  ]},
];

const INITIAL_SOCIAL_FEED = [
  { id: 101, user: 'Anna K.', role: 'Yoga Instructor', title: '心と体を整える朝の3時間', likes: 120, avatar: '🧘‍♀️', routine: [
    { time: '05:30', title: 'Sun Salutation', thought: '日の出とともに太陽礼拝。身体を目覚めさせ、一日の始まりに感謝を捧げる。', type: 'nature' },
    { time: '06:30', title: 'Meditation', thought: '呼吸に意識を向け、心を静める。20分間、ただ「今」に存在する。', type: 'mind' },
    { time: '07:30', title: 'Healthy Breakfast', thought: 'スムージーとオートミール。身体が喜ぶものを丁寧にいただく。', type: 'nature' },
    { time: '08:30', title: 'Journaling', thought: '感謝していること3つを書き出す。小さな幸せに気づく練習。', type: 'mind' },
  ]},
];

// --- Sub Components ---

const AuthModal = ({ onClose, onAuthSuccess }: any) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const { error: authError } = mode === 'signup' 
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (authError) setError(authError.message);
    else onAuthSuccess();
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in">
      <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl">
        <h3 className="text-xl font-serif font-bold text-stone-800 mb-2">{mode === 'signin' ? 'Welcome Back' : 'Join Life OS'}</h3>
        <p className="text-stone-400 text-xs mb-6">{mode === 'signin' ? 'Login to sync your routine' : 'Create an account to start'}</p>
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-stone-400 uppercase">Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full p-3 bg-stone-50 rounded-xl border border-stone-200" required />
          </div>
          <div>
            <label className="text-[10px] font-bold text-stone-400 uppercase">Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full p-3 bg-stone-50 rounded-xl border border-stone-200" required />
          </div>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button type="submit" className="w-full py-3 bg-stone-800 text-white rounded-xl font-bold">{mode === 'signin' ? 'Log In' : 'Sign Up'}</button>
        </form>
        <button onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')} className="w-full mt-4 text-xs text-stone-400 hover:text-stone-600">{mode === 'signin' ? 'No account? Sign up' : 'Have an account? Log in'}</button>
        <button onClick={onClose} className="w-full mt-2 text-xs text-stone-300">Close</button>
      </div>
    </div>
  );
};

const AddTaskModal = ({ onClose, onAdd }: any) => {
  const [task, setTask] = useState({ time: '12:00', endTime: '13:00', title: '', thought: '', type: 'work' });
  return (
    <div className="absolute inset-0 z-50 bg-stone-900/20 backdrop-blur-sm flex items-end justify-center p-6 animate-in slide-in-from-bottom-10">
      <div className="bg-white w-full rounded-2xl p-6 shadow-xl">
        <h3 className="font-bold mb-4">Add Task</h3>
        <div className="flex gap-2 mb-2">
          <input type="time" value={task.time} onChange={e=>setTask({...task, time: e.target.value})} className="border p-2 rounded w-full"/>
          <input type="time" value={task.endTime} onChange={e=>setTask({...task, endTime: e.target.value})} className="border p-2 rounded w-full"/>
        </div>
        <input type="text" placeholder="Title" value={task.title} onChange={e=>setTask({...task, title: e.target.value})} className="border p-2 rounded w-full mb-2"/>
        <textarea placeholder="Note" value={task.thought} onChange={e=>setTask({...task, thought: e.target.value})} className="border p-2 rounded w-full mb-4 h-24 resize-none"/>
        <div className="flex gap-2 mb-4">
           {['nature', 'mind', 'work'].map(t => (
             <button key={t} onClick={() => setTask({...task, type: t})} className={`px-3 py-1 rounded text-xs capitalize ${task.type === t ? 'bg-stone-800 text-white' : 'bg-stone-100'}`}>{t}</button>
           ))}
        </div>
        <button onClick={() => onAdd(task)} className="w-full bg-green-700 text-white py-3 rounded-xl font-bold">Add</button>
        <button onClick={onClose} className="w-full mt-2 text-stone-400">Cancel</button>
      </div>
    </div>
  );
};

const TaskDetailModal = ({ task, onClose, onDelete, onEdit }: any) => {
  if (!task) return null;
  return (
    <div className="absolute inset-0 z-50 bg-stone-900/20 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#FDFCF8] w-full max-w-sm rounded-3xl border border-stone-100 shadow-2xl p-6 relative animate-in slide-in-from-bottom-10">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-stone-100 rounded-full text-stone-400 hover:text-stone-800"><X size={18}/></button>
        <div className="flex items-center gap-3 mb-4">
          {task.type === 'nature' && <div className="p-2 bg-orange-50 rounded-lg"><Sun size={20} className="text-orange-400" /></div>}
          {task.type === 'mind' && <div className="p-2 bg-blue-50 rounded-lg"><BookOpen size={20} className="text-blue-400" /></div>}
          {task.type === 'work' && <div className="p-2 bg-stone-100 rounded-lg"><Coffee size={20} className="text-stone-600" /></div>}
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Schedule</span>
            <span className="text-lg font-mono font-bold text-stone-800">{task.time} - {task.endTime || '...'}</span>
          </div>
        </div>
        <h3 className="text-2xl font-serif font-bold text-stone-800 mb-4 leading-tight">{task.title}</h3>
        <div className="bg-white p-5 rounded-2xl border border-stone-100 shadow-inner mb-6">
          <p className="text-stone-600 leading-relaxed font-serif italic text-lg">"{task.thought}"</p>
        </div>
        <div className="flex gap-3">
           <button onClick={onClose} className="flex-1 py-3 bg-stone-800 text-white rounded-xl font-bold text-sm shadow-lg">Close</button>
           {!task.isOther && onDelete && <button onClick={onDelete} className="flex-1 py-3 bg-white border border-red-200 text-red-500 rounded-xl font-bold text-sm">Delete</button>}
        </div>
      </div>
    </div>
  );
};

const ScreenTop = ({ go, session, setShowAuthModal }: any) => (
  <div className="flex flex-col h-full bg-[#FDFCF8] text-stone-800 p-8 justify-between relative overflow-hidden font-sans">
    <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-green-100/40 rounded-full blur-3xl" />
    <div className="absolute top-6 right-6 z-20">
      {session ? (
        <div className="flex items-center gap-2 bg-white/50 px-3 py-1 rounded-full border border-stone-100">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-xs text-stone-500 font-bold">{session.user.email?.split('@')[0]}</span>
        </div>
      ) : (
        <button onClick={() => setShowAuthModal(true)} className="text-xs font-bold text-stone-400 hover:text-stone-800 flex items-center gap-1">
          <LogIn size={14}/> Login
        </button>
      )}
    </div>
    <div className="mt-16 z-10">
      <div className="flex items-center gap-2 text-stone-500 mb-6">
        <div className="w-8 h-1 bg-stone-800" />
        <span className="font-bold tracking-widest text-xs uppercase">Life OS</span>
      </div>
      <h1 className="text-5xl font-serif font-bold leading-[1.1] mb-6 text-stone-900">
        Borrow a Life,<br/><span className="text-green-700">Try</span><br/>New Self.
      </h1>
      <p className="text-stone-500 text-lg leading-relaxed font-light">今日は、ちょっと違う一日を借りてみる。</p>
    </div>
    <div className="flex flex-col gap-4 mb-8 z-10">
      <button onClick={() => { if(!session) setShowAuthModal(true); else go('HOME'); }} className="group flex items-center justify-between bg-white p-5 rounded-xl shadow-sm border border-stone-200 hover:border-green-600 transition-all">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-stone-100 rounded-lg text-stone-600 group-hover:bg-green-100 group-hover:text-green-700"><Sun size={24} /></div>
          <div className="text-left"><div className="font-bold text-lg text-stone-800 group-hover:text-green-800">My Routine</div><div className="text-stone-400 text-xs">自分の日常を実行する</div></div>
        </div>
        <ArrowRight className="text-stone-300 group-hover:text-green-600" />
      </button>
      <button onClick={() => go('SOCIAL')} className="group flex items-center justify-between bg-white p-5 rounded-xl shadow-sm border border-stone-200 hover:border-orange-400 transition-all">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-stone-100 rounded-lg text-stone-600 group-hover:bg-orange-100 group-hover:text-orange-700"><Search size={24} /></div>
          <div className="text-left"><div className="font-bold text-lg text-stone-800 group-hover:text-orange-800">Find & Borrow</div><div className="text-stone-400 text-xs">いろんな過ごし方を覗いてみる</div></div>
        </div>
        <ArrowRight className="text-stone-300 group-hover:text-orange-600" />
      </button>
    </div>
  </div>
);

const ScreenSocial = ({ go, setSelectedUser, socialFeed }: any) => {
  const [activeCategory, setActiveCategory] = useState('Recommended');
  
  const CATEGORY_DATA: Record<string, any[]> = {
    'Recommended': [...socialFeed, ...INITIAL_SOCIAL_FEED],
    'Business': [
      { id: 101, user: 'Takeshi M.', role: 'CEO', title: '経営者の朝5時起床ルーティン', likes: 312, avatar: '💼', routine: [{ time: '05:00', title: 'News Check', thought: '日経新聞とWSJ...', type: 'work' }, { time: '06:00', title: 'Strategic Planning', thought: '戦略を練る...', type: 'work' }] },
      { id: 102, user: 'Yuki T.', role: 'Consultant', title: '週7MTGを乗り切る集中術', likes: 189, avatar: '📊', routine: [] },
    ],
    'Creative': [
      { id: 201, user: 'Sakura N.', role: 'Illustrator', title: 'アイデアが湧く散歩', likes: 428, avatar: '🎨', routine: [] },
    ],
    'Wellness': [
      { id: 301, user: 'Mika S.', role: 'Yoga Teacher', title: '心身を整える朝', likes: 521, avatar: '🧘', routine: [] },
    ],
  };
  
  const currentFeed = (CATEGORY_DATA[activeCategory] || []).filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i);

  return (
    <div className="flex flex-col h-full bg-[#FDFCF8] text-stone-800">
      <div className="p-6 pb-4 bg-white/80 backdrop-blur sticky top-0 z-10 border-b border-stone-100">
        <h2 className="text-2xl font-serif font-bold mb-1">Catalog</h2>
        <p className="text-xs text-stone-400">みんなの過ごし方を見てみよう</p>
        <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar">
          {['Recommended', 'Business', 'Creative', 'Wellness'].map((tag) => (
            <span key={tag} onClick={() => setActiveCategory(tag)} className={`px-4 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap cursor-pointer transition-colors ${activeCategory === tag ? 'bg-stone-800 text-white border-stone-800' : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400'}`}>{tag}</span>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {currentFeed.map((post: any) => (
          <div key={post.id} onClick={() => { setSelectedUser(post); go('OTHER_HOME'); }} className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all cursor-pointer group">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-xl">{post.avatar}</div>
                <div><div className="text-sm font-bold text-stone-800">{post.user}</div><div className="text-[10px] text-stone-400 uppercase tracking-wider">{post.role}</div></div>
              </div>
              <div className="px-3 py-1 bg-stone-50 rounded-full text-xs text-stone-500 font-mono group-hover:bg-green-50 group-hover:text-green-700 transition-colors">Try</div>
            </div>
            <h3 className="font-bold text-lg text-stone-800 mb-2 leading-tight group-hover:text-green-800 transition-colors">{post.title}</h3>
            <div className="flex items-center gap-4 text-xs text-stone-400">
              <span className="flex items-center gap-1"><Sun size={12}/> 朝型</span>
              <span className="flex items-center gap-1">⏱ {post.routine?.length || 3}h</span>
              <span className="flex items-center gap-1 text-pink-400">♥ {post.likes}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ScreenEdit = ({ go, myRoutine, personaTemplates, copyTaskFromTemplate, removeCopiedTask, deleteTaskFromRoutine, setShowAddTask }: any) => {
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const isAdded = (tplTask: any) => myRoutine.find((t: any) => t.time === tplTask.time && t.title === tplTask.title);

  return (
    <div className="flex flex-col h-full bg-[#FDFCF8] text-stone-800">
      <div className="p-4 bg-white/80 backdrop-blur-sm sticky top-0 z-20 border-b border-stone-100 flex items-center justify-between">
        <button onClick={() => { setSelectedTemplate(null); go('HOME'); }} className="text-stone-400 hover:text-stone-800 text-sm font-bold">Cancel</button>
        <h2 className="font-bold text-stone-800">Routine Editor</h2>
        <button onClick={() => { setSelectedTemplate(null); go('HOME'); }} className="text-white bg-green-700 px-4 py-1.5 rounded-full text-sm font-bold shadow-lg shadow-green-200 hover:bg-green-800 transition-colors">Done</button>
      </div>
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="py-6 px-4 bg-white border-b border-stone-50">
          <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-3">Templates</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {personaTemplates.map((persona: any) => (
              <div key={persona.id} onClick={() => setSelectedTemplate(selectedTemplate?.id === persona.id ? null : persona)} className={`flex flex-col gap-2 cursor-pointer group min-w-[120px] p-3 rounded-xl border transition-colors ${selectedTemplate?.id === persona.id ? 'bg-green-50 border-green-300' : 'bg-stone-50 border-stone-100 hover:border-stone-300'}`}>
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${persona.color}`}>{persona.name.charAt(0)}</div>
                  <span className="text-xs font-bold text-stone-700 truncate">{persona.name}</span>
                </div>
                <div className="text-[10px] text-stone-500">{persona.title}</div>
              </div>
            ))}
          </div>
        </div>
        
        {selectedTemplate ? (
          <div className="flex-1 flex flex-col">
            <div className="p-4 bg-stone-50 border-b border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold ${selectedTemplate.color}`}>{selectedTemplate.name.charAt(0)}</div>
                <h3 className="text-sm font-bold text-stone-700">{selectedTemplate.name}と比較中</h3>
              </div>
              <button onClick={() => setSelectedTemplate(null)} className="text-xs text-stone-400 hover:text-stone-600 px-3 py-1 bg-white rounded-full border border-stone-200">閉じる</button>
            </div>
            <div className="flex border-b border-stone-100">
              <div className="flex-1 px-4 py-2 bg-orange-50/50"><span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">{selectedTemplate.name}</span></div>
              <div className="w-10" />
              <div className="flex-1 px-4 py-2 bg-green-50/50"><span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">My Routine</span></div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {[...new Set([...selectedTemplate.routine.map((r:any)=>r.time), ...myRoutine.map((r:any)=>r.time)])].sort().map((time, idx) => {
                const tplTask = selectedTemplate.routine.find((r:any)=>r.time===time);
                const myTasks = myRoutine.filter((r:any)=>r.time===time);
                const added = tplTask && isAdded(tplTask);
                return (
                  <div key={idx} className="flex border-b border-stone-50">
                    <div className="flex-1 p-3 bg-orange-50/30">
                      {tplTask ? <div className="bg-white p-3 rounded-xl border border-orange-100 shadow-sm"><div className="font-bold text-xs text-orange-600 mb-1">{tplTask.time}</div><div className="text-xs font-bold text-stone-800">{tplTask.title}</div></div> : <div className="text-center text-xs text-stone-300">-</div>}
                    </div>
                    <div className="w-10 flex items-center justify-center bg-stone-50/50">
                      {tplTask && !added && <button onClick={()=>copyTaskFromTemplate(tplTask)} className="p-1.5 rounded-full bg-white border border-stone-200 text-stone-400 hover:text-green-600"><ArrowRight size={12}/></button>}
                      {added && <button onClick={()=>removeCopiedTask(tplTask)} className="p-1.5 rounded-full bg-green-100 text-green-600"><X size={12}/></button>}
                    </div>
                    <div className="flex-1 p-3 bg-green-50/30">
                      {myTasks.map((t:any, i:number) => <div key={i} className="bg-white p-3 rounded-xl border border-green-100 shadow-sm mb-1"><div className="font-bold text-xs text-green-700 mb-1">{t.time}</div><div className="text-xs font-bold text-stone-800">{t.title}</div></div>)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-3">My Routine</h3>
            {myRoutine.map((item: any, idx: number) => (
              <div key={idx} className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex justify-between items-center">
                <div><div className="font-bold text-sm text-stone-800">{item.time} {item.title}</div><div className="text-xs text-stone-400">{item.thought}</div></div>
                <button onClick={() => deleteTaskFromRoutine(idx)} className="text-stone-300 hover:text-red-500"><X size={16}/></button>
              </div>
            ))}
            <button onClick={() => setShowAddTask(true)} className="w-full py-4 border-2 border-dashed border-stone-200 rounded-xl text-stone-400 hover:border-green-300 hover:text-green-600 transition-all flex items-center justify-center gap-2 font-bold text-sm"><Plus size={16} /> Add Task</button>
          </div>
        )}
      </div>
    </div>
  );
};

const ScreenTimeline = ({ go, targetDate, shiftDate, myRoutine, isOther, selectedUser, setSelectedTask, setBorrowingUser, loadingRoutine }: any) => {
  const d = formatDate(targetDate);
  const isToday = new Date().toDateString() === targetDate.toDateString();
  const routine = isOther && selectedUser ? selectedUser.routine : myRoutine;

  return (
    <div className="flex flex-col h-full bg-[#FDFCF8] text-stone-800">
      <div className="p-4 sticky top-0 bg-[#FDFCF8]/95 backdrop-blur z-20 border-b border-stone-100">
        <div className="flex items-center justify-between mb-4">
           <button onClick={() => isOther ? go('SOCIAL') : go('TOP')} className="flex items-center gap-1 text-xs font-bold text-stone-400 tracking-widest uppercase hover:text-stone-800">{isOther && <ChevronLeft size={14}/>} {isOther ? 'BACK' : 'Life OS'}</button>
           {!isOther && <button onClick={() => go('EDIT')} className="p-2 bg-white rounded-full border border-stone-200 text-stone-600 hover:text-green-700 shadow-sm"><Edit3 size={18} /></button>}
           {isOther && <button onClick={() => { setBorrowingUser(selectedUser); go('BORROW'); }} className="px-4 py-1.5 bg-green-700 text-white rounded-full text-xs font-bold shadow-lg">Borrow</button>}
        </div>
        <div className="flex items-center justify-between">
          <button onClick={() => shiftDate(-1)} className="p-2 hover:bg-stone-100 rounded-full"><ChevronLeft size={24} /></button>
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-serif font-bold text-stone-800 flex items-center gap-2">{isOther && selectedUser ? <><span className="text-2xl">{selectedUser.avatar}</span> {selectedUser.user.split(' ')[0]}'s Day</> : <>{d.dow}, {d.month} {d.day} {isToday && <span className="w-2 h-2 rounded-full bg-green-500" />}</>}</h2>
            {!isOther && <p className="text-xs text-stone-400">{loadingRoutine ? 'Syncing...' : 'My Ideal Day'}</p>}
          </div>
          <button onClick={() => shiftDate(1)} className="p-2 hover:bg-stone-100 rounded-full"><ChevronRight size={24} /></button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-24 pt-4 relative">
        {routine.length === 0 ? <div className="text-center py-8 text-stone-300 text-xs">No tasks yet</div> : (
          <div className="relative" style={{ height: '1200px' }}>
             <div className="absolute left-[46px] top-0 bottom-0 w-[1px] bg-stone-200" />
             {routine.map((item: any, idx: number) => {
               const start = timeToMinutes(item.time);
               const top = (start - 300) * (80/60); 
               if (top < 0) return null; 
               return (
                 <div key={idx} onClick={()=>setSelectedTask({...item, isOther})} className="absolute left-0 right-0 flex gap-4 cursor-pointer group" style={{ top: `${top}px` }}>
                   <div className="w-10 text-right text-xs font-mono text-stone-400 pt-1">{item.time}</div>
                   <div className={`flex-1 p-3 rounded-xl border shadow-sm ${isOther?'bg-white border-stone-100':'bg-white border-stone-100'} hover:border-green-300 transition-all`}>
                     <div className="flex items-center gap-2 mb-1">
                        {item.type==='nature' && <Sun size={12} className="text-orange-400"/>}
                        {item.type==='mind' && <BookOpen size={12} className="text-blue-400"/>}
                        {item.type==='work' && <Coffee size={12} className="text-stone-500"/>}
                        <div className="font-bold text-sm text-stone-800">{item.title}</div>
                     </div>
                     <div className="text-[10px] text-stone-400 line-clamp-1">{item.thought}</div>
                   </div>
                 </div>
               );
             })}
          </div>
        )}
      </div>
    </div>
  );
};

const ScreenBorrow = ({ go, borrowingUser, setBorrowingUser, myRoutine, copyTaskFromTemplate, removeCopiedTask }: any) => {
  if (!borrowingUser) return null;
  const allTimes = [...new Set([...borrowingUser.routine.map((r:any)=>r.time), ...myRoutine.map((r:any)=>r.time)])].sort();
  const isAdded = (task: any) => myRoutine.find((t:any)=>t.time===task.time && t.title===task.title);

  return (
    <div className="flex flex-col h-full bg-[#FDFCF8] text-stone-800">
      <div className="p-4 bg-white/80 backdrop-blur-sm sticky top-0 z-20 border-b border-stone-100 flex items-center justify-between">
        <button onClick={() => { setBorrowingUser(null); go('OTHER_HOME'); }} className="text-stone-400 font-bold text-sm">Back</button>
        <h2 className="font-bold text-stone-800">Borrow Routine</h2>
        <button onClick={() => { setBorrowingUser(null); go('HOME'); }} className="text-white bg-green-700 px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">Done</button>
      </div>
      <div className="flex border-b border-stone-100">
        <div className="flex-1 px-4 py-2 bg-orange-50/50 text-center text-xs font-bold text-orange-600">{borrowingUser.user}</div>
        <div className="w-10"></div>
        <div className="flex-1 px-4 py-2 bg-green-50/50 text-center text-xs font-bold text-green-600">My Routine</div>
      </div>
      <div className="flex-1 overflow-y-auto pb-24">
        {allTimes.map((time, idx) => {
          const userTask = borrowingUser.routine.find((r:any)=>r.time===time);
          const myTasks = myRoutine.filter((r:any)=>r.time===time);
          const added = userTask && isAdded(userTask);
          return (
            <div key={idx} className="flex border-b border-stone-50">
              <div className="flex-1 p-3 bg-orange-50/30">
                {userTask ? <div className="bg-white p-3 rounded-xl border border-orange-100"><div className="text-xs font-bold text-orange-600">{userTask.time}</div><div className="font-bold text-sm">{userTask.title}</div></div> : <div className="text-center text-xs text-stone-300">-</div>}
              </div>
              <div className="w-10 flex items-center justify-center bg-stone-50/50">
                {userTask && !added && <button onClick={()=>copyTaskFromTemplate(userTask)} className="p-1.5 rounded-full bg-white border"><ArrowRight size={12}/></button>}
                {added && <button onClick={()=>removeCopiedTask(userTask)} className="p-1.5 rounded-full bg-green-100 text-green-600"><X size={12}/></button>}
              </div>
              <div className="flex-1 p-3 bg-green-50/30">
                {myTasks.map((t:any,i:number)=><div key={i} className="bg-white p-3 rounded-xl border border-green-100 mb-1"><div className="text-xs font-bold text-green-700">{t.time}</div><div className="font-bold text-sm">{t.title}</div></div>)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- FULLY RESTORED SETTINGS SCREEN ---
const ScreenSettings = ({ go, session }: any) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [morningReminder, setMorningReminder] = useState('07:00');
  const [darkMode, setDarkMode] = useState(false);
  const [publicProfile, setPublicProfile] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showEditEmail, setShowEditEmail] = useState(false);
  const [profileName, setProfileName] = useState('My Garden');
  const [profileBio, setProfileBio] = useState('Life OS enthusiast');
  const [email, setEmail] = useState(session?.user?.email || 'user@example.com');
  
  return (
    <div className="flex flex-col h-full bg-[#FDFCF8] text-stone-800 relative">
      {/* Header */}
      <div className="p-4 bg-white/80 backdrop-blur-sm sticky top-0 z-20 border-b border-stone-100 flex items-center justify-between">
        <button onClick={() => go('PROFILE')} className="flex items-center gap-1 text-stone-400 hover:text-stone-800 text-sm font-bold">
          <ChevronLeft size={18} /> Back
        </button>
        <h2 className="font-bold text-stone-800">Settings</h2>
        <div className="w-16" />
      </div>
      
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Account Section */}
        <div className="p-4">
          <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-3">Account</h3>
          <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
            <button onClick={() => setShowEditProfile(true)} className="w-full p-4 flex items-center gap-4 border-b border-stone-50 hover:bg-stone-50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-2xl">🌱</div>
              <div className="flex-1 text-left">
                <h4 className="font-bold text-stone-800">{profileName}</h4>
                <p className="text-xs text-stone-400">Edit profile</p>
              </div>
              <ChevronRight size={18} className="text-stone-300" />
            </button>
            <button onClick={() => setShowEditEmail(true)} className="w-full p-4 flex items-center justify-between border-b border-stone-50 hover:bg-stone-50 transition-colors">
              <div className="text-left">
                <h4 className="font-bold text-sm text-stone-800">Email</h4>
                <p className="text-xs text-stone-400">{email}</p>
              </div>
              <ChevronRight size={18} className="text-stone-300" />
            </button>
            <div className="p-4 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-stone-800">Public Profile</h4>
                <p className="text-xs text-stone-400">Allow others to see your routine</p>
              </div>
              <button
                onClick={() => setPublicProfile(!publicProfile)}
                className={`w-12 h-7 rounded-full transition-colors relative ${publicProfile ? 'bg-green-500' : 'bg-stone-200'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all shadow-sm ${publicProfile ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Notifications Section */}
        <div className="p-4">
          <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-3">Notifications</h3>
          <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
            <div className="p-4 flex items-center justify-between border-b border-stone-50">
              <div>
                <h4 className="font-bold text-sm text-stone-800">Push Notifications</h4>
                <p className="text-xs text-stone-400">Receive reminders for your routine</p>
              </div>
              <button
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`w-12 h-7 rounded-full transition-colors relative ${notificationsEnabled ? 'bg-green-500' : 'bg-stone-200'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all shadow-sm ${notificationsEnabled ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-stone-800">Morning Reminder</h4>
                <p className="text-xs text-stone-400">Daily reminder to start your routine</p>
              </div>
              <input
                type="time"
                value={morningReminder}
                onChange={(e) => setMorningReminder(e.target.value)}
                className="text-sm font-mono text-green-700 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200"
              />
            </div>
          </div>
        </div>
        
        {/* Appearance Section */}
        <div className="p-4">
          <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-3">Appearance</h3>
          <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
            <div className="p-4 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-stone-800">Dark Mode</h4>
                <p className="text-xs text-stone-400">Use dark theme</p>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-12 h-7 rounded-full transition-colors relative ${darkMode ? 'bg-green-500' : 'bg-stone-200'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all shadow-sm ${darkMode ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Data Section */}
        <div className="p-4">
          <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-3">Data</h3>
          <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
            <button className="w-full p-4 flex items-center justify-between border-b border-stone-50 hover:bg-stone-50 transition-colors">
              <h4 className="font-bold text-sm text-stone-800">Export My Data</h4>
              <ChevronRight size={18} className="text-stone-300" />
            </button>
            <button className="w-full p-4 flex items-center justify-between hover:bg-stone-50 transition-colors">
              <h4 className="font-bold text-sm text-stone-800">Clear All Routines</h4>
              <ChevronRight size={18} className="text-stone-300" />
            </button>
          </div>
        </div>
        
        {/* Danger Zone */}
        <div className="p-4">
          <h3 className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-3">Danger Zone</h3>
          <div className="bg-white rounded-2xl border border-red-100 overflow-hidden">
            <button className="w-full p-4 flex items-center justify-between hover:bg-red-50 transition-colors">
              <div>
                <h4 className="font-bold text-sm text-red-600">Delete Account</h4>
                <p className="text-xs text-red-400">Permanently delete your account and data</p>
              </div>
              <ChevronRight size={18} className="text-red-300" />
            </button>
          </div>
        </div>
        
        {/* App Info */}
        <div className="p-4 text-center">
          <p className="text-xs text-stone-300">Life OS v1.0.0</p>
          <p className="text-[10px] text-stone-300 mt-1">Made with care</p>
        </div>
      </div>
      
      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="absolute inset-0 z-50 bg-stone-900/20 backdrop-blur-sm flex items-end justify-center animate-in fade-in duration-200">
          <div className="bg-[#FDFCF8] w-full rounded-t-3xl border-t border-stone-100 shadow-2xl p-6 animate-in slide-in-from-bottom-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-stone-800">Edit Profile</h3>
              <button onClick={() => setShowEditProfile(false)} className="p-2 bg-stone-100 rounded-full text-stone-400 hover:text-stone-800"><X size={18}/></button>
            </div>
            
            <div className="space-y-4">
              {/* Avatar */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center text-4xl">🌱</div>
                <button className="text-xs text-green-700 font-bold">Change Avatar</button>
              </div>
              
              {/* Name */}
              <div>
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2 block">Display Name</label>
                <input 
                  type="text" 
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full p-3 bg-white border border-stone-200 rounded-xl text-stone-800"
                />
              </div>
              
              {/* Bio */}
              <div>
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2 block">Bio</label>
                <textarea 
                  value={profileBio}
                  onChange={(e) => setProfileBio(e.target.value)}
                  placeholder="Tell others about yourself..."
                  className="w-full p-3 bg-white border border-stone-200 rounded-xl text-stone-800 h-24 resize-none"
                />
              </div>
              
              {/* Timezone */}
              <div>
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2 block">Timezone</label>
                <select className="w-full p-3 bg-white border border-stone-200 rounded-xl text-stone-800">
                  <option>Asia/Tokyo (GMT+9)</option>
                  <option>America/New_York (GMT-5)</option>
                  <option>Europe/London (GMT+0)</option>
                  <option>America/Los_Angeles (GMT-8)</option>
                </select>
              </div>
            </div>
            
            <button 
              onClick={() => setShowEditProfile(false)}
              className="w-full mt-6 py-4 bg-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-200 hover:bg-green-800 transition-colors"
            >
              Save Profile
            </button>
          </div>
        </div>
      )}
      
      {/* Edit Email Modal */}
      {showEditEmail && (
        <div className="absolute inset-0 z-50 bg-stone-900/20 backdrop-blur-sm flex items-end justify-center animate-in fade-in duration-200">
          <div className="bg-[#FDFCF8] w-full rounded-t-3xl border-t border-stone-100 shadow-2xl p-6 animate-in slide-in-from-bottom-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-stone-800">Change Email</h3>
              <button onClick={() => setShowEditEmail(false)} className="p-2 bg-stone-100 rounded-full text-stone-400 hover:text-stone-800"><X size={18}/></button>
            </div>
            
            <div className="space-y-4">
              {/* Current Email */}
              <div>
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2 block">Current Email</label>
                <div className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-500">{email}</div>
              </div>
              
              {/* New Email */}
              <div>
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2 block">New Email</label>
                <input 
                  type="email" 
                  placeholder="Enter new email address"
                  className="w-full p-3 bg-white border border-stone-200 rounded-xl text-stone-800"
                />
              </div>
              
              {/* Password Confirmation */}
              <div>
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2 block">Confirm Password</label>
                <input 
                  type="password" 
                  placeholder="Enter your password to confirm"
                  className="w-full p-3 bg-white border border-stone-200 rounded-xl text-stone-800"
                />
              </div>
              
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-3">
                <p className="text-xs text-orange-700">A verification email will be sent to your new address. Please check your inbox to complete the change.</p>
              </div>
            </div>
            
            <button 
              onClick={() => setShowEditEmail(false)}
              className="w-full mt-6 py-4 bg-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-200 hover:bg-green-800 transition-colors"
            >
              Update Email
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const ScreenProfile = ({ go }: any) => (
  <div className="flex flex-col h-full bg-[#FDFCF8] text-stone-800">
    <div className="p-6 border-b border-stone-100 bg-white/50">
      <div className="flex justify-end mb-4"><button onClick={() => go('SETTINGS')}><Settings size={20} className="text-stone-300 hover:text-stone-600" /></button></div>
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-stone-100 border-2 border-stone-200 flex items-center justify-center text-3xl">🌱</div>
        <div><h2 className="text-2xl font-serif font-bold text-stone-800">My Garden</h2><p className="text-xs text-stone-400 uppercase tracking-wider mt-1">Status: Sprouting</p></div>
      </div>
    </div>
    <div className="p-6 grid grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex flex-col items-center text-center">
        <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-2"><Sprout size={20}/></div>
        <div className="text-2xl font-bold text-stone-800">12</div><div className="text-[10px] text-stone-400 font-bold uppercase">Days Active</div>
      </div>
      <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex flex-col items-center text-center">
        <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mb-2"><Award size={20}/></div>
        <div className="text-2xl font-bold text-stone-800">3</div><div className="text-[10px] text-stone-400 font-bold uppercase">Badges</div>
      </div>
    </div>
  </div>
);

const BottomNav = ({ go, currentScreen }: any) => (
  <div className="absolute bottom-0 w-full bg-white/90 backdrop-blur border-t border-stone-200 flex justify-around p-2 pb-6 z-30">
    <button onClick={() => go('HOME')} className={`flex flex-col items-center w-16 ${['HOME','OTHER_HOME'].includes(currentScreen)?'text-green-700':'text-stone-400'}`}><Calendar size={22}/><span className="text-[10px] font-bold">Home</span></button>
    <button onClick={() => go('SOCIAL')} className={`flex flex-col items-center w-16 ${currentScreen==='SOCIAL'?'text-orange-600':'text-stone-400'}`}><Search size={22}/><span className="text-[10px] font-bold">Search</span></button>
    <button onClick={() => go('PROFILE')} className={`flex flex-col items-center w-16 ${currentScreen==='PROFILE'?'text-stone-800':'text-stone-400'}`}><User size={22}/><span className="text-[10px] font-bold">Me</span></button>
  </div>
);

// --- Main Application ---
export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('TOP');
  const [targetDate, setTargetDate] = useState(new Date());
  const [session, setSession] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);

  // Data
  const [personaTemplates, setPersonaTemplates] = useState<any[]>(INITIAL_TEMPLATES);
  const [socialFeed, setSocialFeed] = useState<any[]>([]);
  const [myRoutine, setMyRoutine] = useState<any[]>([]);
  const [loadingRoutine, setLoadingRoutine] = useState(false);
  
  // UI Selection
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [borrowingUser, setBorrowingUser] = useState<any>(null);

  // --- Auth & Data Loading ---
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchUserRoutine(session.user.id, targetDate);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchUserRoutine(session.user.id, targetDate);
      else setMyRoutine([]);
    });
    fetchPublicData();
    return () => subscription.unsubscribe();
  }, []);

  const fetchPublicData = async () => {
    const { data: routines } = await supabase.from('routines').select(`*, routine_items(*)`);
    if (routines) {
      const format = (list: any[]) => list.map(r => ({
        id: r.id, 
        name: r.role_label, // 追加: nameプロパティ
        user: r.role_label, 
        title: r.title, 
        likes: r.likes_count, 
        avatar: '👤',
        color: r.theme_color, // 追加: colorプロパティ
        routine: r.routine_items.map((i: any) => ({ time: i.start_time, endTime: i.end_time, title: i.title, thought: i.thought, type: i.type })).sort((a:any, b:any) => a.time.localeCompare(b.time))
      }));
      const dbTemplates = format(routines.filter(r => r.is_template));
      const dbFeed = format(routines.filter(r => !r.is_template));
      if (dbTemplates.length > 0) setPersonaTemplates(dbTemplates); 
      setSocialFeed(dbFeed);
    }
  };

  const fetchUserRoutine = async (userId: string, date: Date) => {
    setLoadingRoutine(true);
    const { data } = await supabase.from('user_tasks').select('*').eq('user_id', userId).eq('target_date', formatDate(date).iso).order('start_time');
    if (data) setMyRoutine(data.map(t => ({ id: t.id, time: t.start_time, endTime: t.end_time, title: t.title, thought: t.thought, type: t.type })));
    setLoadingRoutine(false);
  };

  const handleAddTask = async (task: any) => {
    if (!session) return;
    const newTask = { user_id: session.user.id, target_date: formatDate(targetDate).iso, title: task.title, thought: task.thought, type: task.type, start_time: task.time, end_time: task.endTime };
    setMyRoutine([...myRoutine, { ...task, id: 'temp' }].sort((a,b)=>a.time.localeCompare(b.time))); // Optimistic
    setShowAddTask(false);
    await supabase.from('user_tasks').insert(newTask);
    fetchUserRoutine(session.user.id, targetDate);
  };

  const handleDeleteTask = async (index: number) => {
    const task = myRoutine[index];
    setMyRoutine(myRoutine.filter((_, i) => i !== index));
    if (task.id !== 'temp') await supabase.from('user_tasks').delete().eq('id', task.id);
  };

  const copyTaskFromTemplate = (task: any) => {
    if (!myRoutine.find(t => t.time === task.time && t.title === task.title)) handleAddTask(task);
  };

  const removeCopiedTask = (task: any) => {
    const idx = myRoutine.findIndex(t => t.time === task.time && t.title === task.title);
    if (idx !== -1) handleDeleteTask(idx);
  };

  const shiftDate = (days: number) => {
    const newDate = new Date(targetDate);
    newDate.setDate(targetDate.getDate() + days);
    setTargetDate(newDate);
    if (session) fetchUserRoutine(session.user.id, newDate);
  };

  const go = (s: Screen) => setCurrentScreen(s);

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-[#FDFCF8] overflow-hidden relative font-sans antialiased shadow-2xl border-x border-stone-200">
      {currentScreen === 'TOP' && <ScreenTop go={go} session={session} setShowAuthModal={setShowAuthModal} />}
      {currentScreen === 'HOME' && <ScreenTimeline go={go} targetDate={targetDate} shiftDate={shiftDate} myRoutine={myRoutine} loadingRoutine={loadingRoutine} setSelectedTask={setSelectedTask} />}
      {currentScreen === 'OTHER_HOME' && <ScreenTimeline go={go} targetDate={targetDate} shiftDate={shiftDate} myRoutine={myRoutine} isOther={true} selectedUser={selectedUser} setBorrowingUser={setBorrowingUser} setSelectedTask={setSelectedTask} />}
      {currentScreen === 'EDIT' && <ScreenEdit go={go} myRoutine={myRoutine} personaTemplates={personaTemplates} copyTaskFromTemplate={copyTaskFromTemplate} removeCopiedTask={removeCopiedTask} deleteTaskFromRoutine={handleDeleteTask} setShowAddTask={setShowAddTask} />}
      {currentScreen === 'SOCIAL' && <ScreenSocial go={go} setSelectedUser={setSelectedUser} socialFeed={socialFeed} />}
      {currentScreen === 'PROFILE' && <ScreenProfile go={go} />}
      {currentScreen === 'BORROW' && <ScreenBorrow go={go} borrowingUser={borrowingUser} setBorrowingUser={setBorrowingUser} myRoutine={myRoutine} copyTaskFromTemplate={copyTaskFromTemplate} removeCopiedTask={removeCopiedTask} />}
      {currentScreen === 'SETTINGS' && <ScreenSettings go={go} session={session} />}
      
      <BottomNav go={go} currentScreen={currentScreen} />
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onAuthSuccess={() => setShowAuthModal(false)} />}
      {showAddTask && <AddTaskModal onClose={() => setShowAddTask(false)} onAdd={handleAddTask} />}
      {selectedTask && <TaskDetailModal task={selectedTask} onClose={() => setSelectedTask(null)} onDelete={() => { handleDeleteTask(myRoutine.indexOf(selectedTask)); setSelectedTask(null); }} />}
    </div>
  );
}