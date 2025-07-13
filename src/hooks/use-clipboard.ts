import { useState } from "react";

interface UseClipboardOptions {
  type: "HTML" | "CSS";
  timeout?: number;
}

export function useClipboard(options: UseClipboardOptions) {
  const [isCopied, setIsCopied] = useState(false);
  const [success, setSuccess] = useState(false);
  const timeout = options.timeout || 2000;

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setSuccess(true);
      setTimeout(() => {
        setIsCopied(false);
        setSuccess(false);
      }, timeout);
    } catch {
      setIsCopied(false);
    }
  };

  return { isCopied, copy, success };
}
