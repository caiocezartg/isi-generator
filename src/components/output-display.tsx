import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import { ClipboardCheck, ClipboardList, Smartphone, Monitor, Trash2 } from 'lucide-react';
import { useIsiStore } from '@/store/useIsiStore';

type OutputDisplayProps = {
  htmlContent: string;
  cssContent: string;
  onClear: () => void;
};

const EMAIL_BOILERPLATE_STYLES = `
  @media only screen and (max-width: 599px) {
    .wrapper {
      width: 100% !important;
      min-width: 0 !important;
    }
    .gutter {
      width: 15px !important;
    }
  }
`;

const Preview = ({ srcDoc, iframeStyle }: {
  srcDoc: string;
  iframeStyle: React.CSSProperties;
}) => (
  <div className="flex-1 rounded-md border-2 p-2">
    <iframe
      srcDoc={srcDoc}
      title="Preview"
      sandbox="allow-scripts"
      className="h-[400px] w-full transition-all duration-300 ease-in-out"
      style={iframeStyle}
    />
  </div>
);

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
      <pre className="text-xs">{code}</pre>
    </div>
  </div>
);

export function OutputDisplay({
  htmlContent,
  cssContent,
  onClear,
}: OutputDisplayProps) {
  if (!htmlContent) {
    return <p className="text-sm text-red-500">No HTML content provided.</p>;
  }

  const [isHtmlCopied, setIsHtmlCopied] = useState(false);
  const [isCssCopied, setIsCssCopied] = useState(false);
  const [view, setView] = useState('desktop');
  const { toast } = useToast();

  const activeTab = useIsiStore((state) => state.activeTab);
  let finalCssForPreview = cssContent || ''; 

  useEffect(() => {
    if (activeTab === 'banner') {
      setView('desktop');
    }
  }, [activeTab]);

  const copyToClipboard = ({text, type}: {
    text: string;
    type: 'HTML' | 'CSS';
  }) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({ description: `${type} copied to your clipboard.` });
        if (type === 'HTML') setIsHtmlCopied(true);
        if (type === 'CSS') setIsCssCopied(true);
        setTimeout(() => {
          setIsHtmlCopied(false);
          setIsCssCopied(false);
        }, 2000);
      })
      .catch(() => {
        toast({ description: `Failed to copy ${type}.`, variant: 'destructive' });
      });
  };

  if (activeTab === 'email' && view === 'mobile') {
    finalCssForPreview += EMAIL_BOILERPLATE_STYLES;
  }
  
  const srcDoc = `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              margin: 0; 
              padding: ${activeTab === 'email' ? '0' : '1rem'};
              background-color: ${activeTab === 'email' ? '#EFEFEF' : '#333'};
            }
            ${finalCssForPreview}
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `;
  
  const iframeStyle = (activeTab === 'email' && view === 'mobile')
    ? { width: '375px', maxWidth: '100%' }
    : { width: '100%' };

  return (
    <div className="flex w-full flex-col gap-4 md:w-1/2">
      <div className="flex justify-end">
        <Button onClick={onClear} variant="destructive" size="sm">
          <Trash2 className="mr-2 h-4 w-4" /> Clear All
        </Button>
      </div>

      <Accordion 
        type="multiple" 
        defaultValue={['preview-item', 'code-item']}
        className="w-full"
      >
      
        <AccordionItem value="preview-item">
          <AccordionTrigger>
            <div className="flex w-full items-center justify-between pr-4">
              <span className="font-bold">Preview</span>
              {activeTab === 'email' && (
                  <span className="text-xs font-normal capitalize text-muted-foreground">({view})</span>
                )}
              
              <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                <Button variant={view === 'desktop' ? 'secondary' : 'ghost'} size="icon" onClick={() => setView('desktop')} className="h-8 w-8">
                  <Monitor size={16} />
                </Button>
                <Button 
                  variant={view === 'mobile' ? 'secondary' : 'ghost'} 
                  size="icon" 
                  onClick={() => setView('mobile')} 
                  className="h-8 w-8"
                  disabled={activeTab === 'banner'}
                >
                  <Smartphone size={16} />
                </Button>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Preview srcDoc={srcDoc} iframeStyle={iframeStyle} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="code-item">
          <AccordionTrigger>
            <span className="font-bold">Generated Code</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-4">
              <CodeBlock 
                title="HTML" 
                code={htmlContent} 
                isCopied={isHtmlCopied} 
                onCopy={() => copyToClipboard({ text: htmlContent, type: 'HTML' })} 
              />
              {cssContent && (
                 <CodeBlock 
                  title="CSS" 
                  code={cssContent} 
                  isCopied={isCssCopied} 
                  onCopy={() => copyToClipboard({ text: cssContent, type: 'CSS' })} 
                />
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}