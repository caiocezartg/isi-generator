import { Button } from './ui/button';
import { ClipboardCheck, ClipboardList} from 'lucide-react';

import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript'
import { monokaiSublime } from 'react-syntax-highlighter/dist/esm/styles/hljs';

SyntaxHighlighter.registerLanguage('javascript', js);

const CodeBlock = ({ title, code, isCopied, onCopy }: {
    title: string;
    code: string;
    isCopied: boolean;
    onCopy: () => void;
  }) => (
    <div className="relative flex max-h-[300px] w-full">
      <p className="absolute left-4 top-2 z-10 text-sm font-bold">{title}</p>
      <Button
        size="icon"
        variant="outline"
        className="absolute right-2 top-2 z-10 h-8 w-8"
        onClick={onCopy}
        title={`Copy ${title}`}
      >
        {isCopied ? <ClipboardCheck size={16} /> : <ClipboardList size={16} />}
      </Button>
      <div className="w-full overflow-y-auto rounded-md border-2 p-4 pt-10 scrollbar scrollbar-track-transparent scrollbar-thumb-zinc-800">
        <SyntaxHighlighter 
            language="javascript" 
            style={monokaiSublime}
            showLineNumbers
            wrapLines
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );

export default CodeBlock