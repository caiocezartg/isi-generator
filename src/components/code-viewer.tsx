import { useState } from "react";
import { useToast } from "./ui/use-toast";
import { Button } from "./ui/button";
import { ClipboardCheck, ClipboardList } from "lucide-react";

interface CodeViewerProps {
  title: string;
  code: string;
}

export function CodeViewer({ title, code }: CodeViewerProps) {
  if (!title || !code) {
    return <p className="text-sm text-red-500">Invalid code or title provided.</p>;
  }
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = () => {
    if (!code) return;
    navigator.clipboard
      .writeText(code)
      .then(() => {
        toast({ description: `${title} copied to your clipboard.` });
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(() => {
        toast({ description: `Failed to copy ${title}.`, variant: "destructive" });
      });
  };

  return (
    <div>
      <p className="mb-2 text-sm font-bold">{title}</p>
      <div className="relative flex max-h-[300px] w-full">
        <Button
          size="icon"
          variant="outline"
          className="absolute right-2 top-2 z-10 h-8 w-8"
          onClick={copyToClipboard}
          title={`Copy ${title}`}
        >
          {isCopied ? <ClipboardCheck size={16} /> : <ClipboardList size={16} />}
        </Button>
        <div className="w-full overflow-y-auto rounded-md border-2 p-4 pr-12 scrollbar scrollbar-track-transparent scrollbar-thumb-zinc-800">
          <pre className="text-xs">{code || `// ${title} code will appear here...`}</pre>
        </div>
      </div>
    </div>
  );
}