"use client";

import React, { useState } from 'react';
import { Sparkles, ChevronRight, Sun, Moon, Scale } from 'lucide-react';
import { PERSONA_CATEGORY_LABELS } from '../lib/mockData';
import type { PersonaCategory, OnboardingPreferences } from '../lib/types';

type Props = {
  onComplete: (prefs: OnboardingPreferences) => void;
  onSkip: () => void;
};

// Categories available for selection (exclude 'all' and 'custom')
const SELECTABLE_CATEGORIES = Object.entries(PERSONA_CATEGORY_LABELS).filter(
  ([key]) => key !== 'all' && key !== 'custom'
) as [PersonaCategory, string][];

const CATEGORY_EMOJI: Record<string, string> = {
  morning: '🌅',
  wellness: '🧘',
  business: '💼',
  creative: '🎨',
  minimalist: '✨',
  student: '📚',
  fitness: '💪',
  cooking: '🍳',
  reading: '📖',
  nightowl: '🌙',
  productivity: '⚡',
  parenting: '👶',
  travel: '✈️',
  spiritual: '🧘‍♂️',
  digital: '💻',
  social: '🤝',
};

export const ScreenOnboarding = ({ onComplete, onSkip }: Props) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedCategories, setSelectedCategories] = useState<PersonaCategory[]>([]);
  const [lifestyleRhythm, setLifestyleRhythm] = useState<'morning' | 'night' | 'balanced' | null>(null);

  const toggleCategory = (cat: PersonaCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleComplete = () => {
    onComplete({
      completed: true,
      selectedCategories,
      lifestyleRhythm,
      prefecture: null,
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#FDFCF8] text-stone-800">
      {/* Progress bar */}
      <div className="px-6 pt-6 pb-2">
        <div className="flex gap-2">
          <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-stone-800' : 'bg-stone-200'}`} />
          <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-stone-800' : 'bg-stone-200'}`} />
        </div>
      </div>

      {step === 1 ? (
        /* ── Step 1: Category Selection ── */
        <div className="flex-1 flex flex-col px-6 pt-4 pb-6 overflow-y-auto">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={20} className="text-orange-500" />
              <h2 className="text-xl font-serif font-bold">Choose your interests</h2>
            </div>
            <p className="text-sm text-stone-400">
              Routines from selected categories will be prioritized
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 flex-1">
            {SELECTABLE_CATEGORIES.map(([key, label]) => {
              const isSelected = selectedCategories.includes(key);
              return (
                <button
                  key={key}
                  onClick={() => toggleCategory(key)}
                  className={`flex items-center gap-2.5 px-4 py-3.5 rounded-xl border-2 text-left transition-all ${
                    isSelected
                      ? 'border-stone-800 bg-stone-800 text-white shadow-md'
                      : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                  }`}
                >
                  <span className="text-lg">{CATEGORY_EMOJI[key] || '📌'}</span>
                  <span className="text-sm font-medium">{label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={() => setStep(2)}
              disabled={selectedCategories.length === 0}
              className="w-full py-3.5 bg-stone-800 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-stone-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next <ChevronRight size={16} />
            </button>
            <button
              onClick={onSkip}
              className="w-full py-2 text-stone-400 text-xs hover:text-stone-500 transition-colors"
            >
              Skip and explore freely
            </button>
          </div>
        </div>
      ) : (
        /* ── Step 2: Lifestyle Rhythm ── */
        <div className="flex-1 flex flex-col px-6 pt-4 pb-6">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={20} className="text-orange-500" />
              <h2 className="text-xl font-serif font-bold">What&apos;s your lifestyle rhythm?</h2>
            </div>
            <p className="text-sm text-stone-400">
              We&apos;ll recommend routines that match your style
            </p>
          </div>

          <div className="space-y-4 flex-1">
            {([
              { value: 'morning' as const, icon: Sun, label: 'Morning', desc: 'Active and productive in the morning' },
              { value: 'night' as const, icon: Moon, label: 'Night Owl', desc: 'Most focused at night' },
              { value: 'balanced' as const, icon: Scale, label: 'Balanced', desc: 'No strong preference' },
            ]).map(({ value, icon: Icon, label, desc }) => {
              const isSelected = lifestyleRhythm === value;
              return (
                <button
                  key={value}
                  onClick={() => setLifestyleRhythm(value)}
                  className={`w-full flex items-center gap-4 px-5 py-5 rounded-xl border-2 text-left transition-all ${
                    isSelected
                      ? 'border-stone-800 bg-stone-800 text-white shadow-md'
                      : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                  }`}
                >
                  <Icon size={24} className={isSelected ? 'text-orange-300' : 'text-stone-400'} />
                  <div>
                    <div className="font-bold text-sm">{label}</div>
                    <div className={`text-xs mt-0.5 ${isSelected ? 'text-stone-300' : 'text-stone-400'}`}>{desc}</div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={handleComplete}
              className="w-full py-3.5 bg-stone-800 text-white rounded-xl font-bold text-sm hover:bg-stone-700 transition-colors"
            >
              Get Started
            </button>
            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="py-2 text-stone-400 text-xs hover:text-stone-500 transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={onSkip}
                className="py-2 text-stone-400 text-xs hover:text-stone-500 transition-colors"
              >
                Skip and explore freely
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
