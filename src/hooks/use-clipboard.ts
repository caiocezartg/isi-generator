import { useState } from "react";

interface UseClipboardOptions {
  type: "HTML" | "CSS";
  timeout?: number;
}

export function useClipboard(options: UseClipboardOptions) {
  const [isCopied, setIsCopied] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const timeout = options.timeout || 2000;

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setSuccessMessage(`${options.type} copied to clipboard!`);
      setTimeout(() => {
        setIsCopied(false);
        setSuccessMessage("");
      }, timeout);
    } catch {
      setIsCopied(false);
    }
  };

  return { isCopied, copy, successMessage };
}
