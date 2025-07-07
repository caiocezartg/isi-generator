import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type IsiState = {
  activeTab: 'email' | 'banner';
  formText: string;
  generatedHtml: string;
  generatedCss: string;
  setActiveTab: (tab: 'email' | 'banner') => void;
  setFormText: (text: string) => void;
  setGeneratedCode: (html: string, css?: string) => void;
  clearAll: () => void;
};

export const useIsiStore = create<IsiState>()(
  persist(
    (set) => ({
      activeTab: 'email',
      formText: '',
      generatedHtml: '',
      generatedCss: '',

      setActiveTab: (tab) => {
        set({ activeTab: tab });
      },
      
      setFormText: (text) => set({ formText: text }),

      setGeneratedCode: (html, css = '') => set({
        generatedHtml: html,
        generatedCss: css,
      }),
      
      clearAll: () => set({
        formText: '',
        generatedHtml: '',
        generatedCss: '',
      }),
    }),
    {
      name: 'isi-generator-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        formText: state.formText,
        generatedHtml: state.generatedHtml,
        generatedCss: state.generatedCss,
      }),
    }
  )
);