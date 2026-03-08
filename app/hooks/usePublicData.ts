"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { PersonaTemplate, SocialPost } from '../lib/types';
import { INITIAL_TEMPLATES, INITIAL_SOCIAL_FEED } from '../lib/mockData';

const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

export const usePublicData = () => {
  const [personaTemplates, setPersonaTemplates] = useState<PersonaTemplate[]>(INITIAL_TEMPLATES);
  const [socialFeed, setSocialFeed] = useState<SocialPost[]>(INITIAL_SOCIAL_FEED);

  useEffect(() => {
    if (IS_DEMO) return; // デモモード中はモックデータを維持
    const fetchPublicData = async () => {
      const { data: routines } = await supabase.from('routines').select(`*, routine_items(*)`);
      if (routines) {
        const format = (list: any[]) =>
          list.map((routine) => ({
            id: routine.id,
            name: routine.role_label,
            user: routine.role_label,
            title: routine.title,
            likes: routine.likes_count,
            avatar: '👤',
            color: routine.theme_color,
            routine: routine.routine_items
              .map((item: any) => ({
                time: item.start_time,
                endTime: item.end_time,
                title: item.title,
                thought: item.thought,
                type: item.type,
              }))
              .sort((a: any, b: any) => a.time.localeCompare(b.time)),
          }));
        const dbTemplates = format(routines.filter((r) => r.is_template));
        const dbFeed = format(routines.filter((r) => !r.is_template));
        if (dbTemplates.length > 0) setPersonaTemplates(dbTemplates);
        setSocialFeed(dbFeed);
      }
    };
    fetchPublicData();
  }, []);

  return { personaTemplates, socialFeed };
};
