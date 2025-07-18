import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type IsiState = {
  activeTab: "email" | "banner";
  formText: string;
  generatedHtml: string;
  generatedCss: string;
  isHtmlCopied: boolean;
  isCssCopied: boolean;
  view: "desktop" | "mobile";
  generatedTypes: string[]; // Novo estado para tipos gerados
  setActiveTab: (tab: "email" | "banner") => void;
  setFormText: (text: string) => void;
  setGeneratedCode: (html: string, css?: string) => void;
  setIsHtmlCopied: (value: boolean) => void;
  setIsCssCopied: (value: boolean) => void;
  setView: (view: "desktop" | "mobile") => void;
  clearAll: () => void;
};

export const useIsiStore = create<IsiState>()(
  persist(
    (set) => ({
      activeTab: "email",
      formText: "",
      generatedHtml: "",
      generatedCss: "",
      isHtmlCopied: false,
      isCssCopied: false,
      view: "desktop",
      generatedTypes: [], // Inicializa vazio

      setActiveTab: (tab) => {
        set({ activeTab: tab });
      },

      setFormText: (text) => set({ formText: text }),

      setGeneratedCode: (html, css) =>
        set({
          generatedHtml: html,
          generatedCss: css,
          generatedTypes: [...(html ? ["html"] : []), ...(css ? ["css"] : [])],
        }),

      setIsHtmlCopied: (value) => set({ isHtmlCopied: value }),
      setIsCssCopied: (value) => set({ isCssCopied: value }),
      setView: (view) => set({ view }),

      clearAll: () =>
        set({
          formText: "",
          generatedHtml: "",
          generatedCss: "",
          isHtmlCopied: false,
          isCssCopied: false,
          view: "desktop",
          generatedTypes: [], // Limpa também os tipos
        }),
    }),
    {
      name: "isi-generator-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        formText: state.formText,
        generatedHtml: state.generatedHtml,
        generatedCss: state.generatedCss,
        isHtmlCopied: state.isHtmlCopied,
        isCssCopied: state.isCssCopied,
        view: state.view,
        generatedTypes: state.generatedTypes, // Persiste os tipos
      }),
    },
  ),
);
