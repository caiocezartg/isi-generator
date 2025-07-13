import { useEffect } from "react";
import { Button } from "./ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Smartphone, Monitor, Trash2 } from "lucide-react";
import { useIsiStore } from "@/store/use-isi-store";
import { useClipboard } from "@/hooks/use-clipboard";
import { Preview } from "./preview";
import { CodeBlock } from "./code-block";

type OutputDisplayProps = {
  htmlContent: string;
  cssContent: string;
  onClear: () => void;
};

export function OutputDisplay({
  htmlContent,
  cssContent,
  onClear,
}: OutputDisplayProps) {
  const activeTab = useIsiStore((state) => state.activeTab);
  const view = useIsiStore((state) => state.view);
  const setView = useIsiStore((state) => state.setView);

  const { isCopied: isHtmlCopied, copy: copyHtml } = useClipboard({
    type: "HTML",
  });
  const { isCopied: isCssCopied, copy: copyCss } = useClipboard({
    type: "CSS",
  });
  useEffect(() => {
    if (activeTab === "banner") {
      setView("desktop");
    }
  }, [activeTab, setView]);

  if (!htmlContent) {
    return <p className="text-sm text-red-500">No HTML content provided.</p>;
  }

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

  let finalCssForPreview = cssContent || "";

  if (activeTab === "email" && view === "mobile") {
    finalCssForPreview += EMAIL_BOILERPLATE_STYLES;
  }

  const srcDoc = `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              margin: 0; 
              padding: ${activeTab === "email" ? "0" : "1rem"};
              background-color: ${activeTab === "email" ? "#EFEFEF" : "#333"};
            }
            ${finalCssForPreview}
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `;

  const iframeStyle =
    activeTab === "email" && view === "mobile"
      ? { width: "375px", maxWidth: "100%" }
      : { width: "600px", maxWidth: "100%" };

  return (
    <div className="flex w-full flex-col gap-4 md:w-1/2">
      <div className="flex justify-end">
        <Button onClick={onClear} variant="destructive" size="sm">
          <Trash2 className="mr-2 h-4 w-4" /> Clear All
        </Button>
      </div>

      <Accordion
        type="multiple"
        defaultValue={["preview-item", "code-item"]}
        className="w-full"
      >
        <AccordionItem value="preview-item">
          <div className="flex w-full items-center justify-between pr-4">
            <AccordionTrigger>
              <span className="mr-2 font-bold">Preview</span>
              {activeTab === "email" && (
                <span className="mr-2 text-xs font-normal capitalize text-muted-foreground">
                  ({view})
                </span>
              )}
            </AccordionTrigger>
            <div
              className="ml-2 flex gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant={view === "desktop" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setView("desktop")}
                className="h-8 w-8"
              >
                <Monitor size={16} />
              </Button>
              <Button
                variant={view === "mobile" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setView("mobile")}
                className="h-8 w-8"
                disabled={activeTab === "banner"}
              >
                <Smartphone size={16} />
              </Button>
            </div>
          </div>
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
                onCopy={() => copyHtml(htmlContent)}
              />
              {cssContent && (
                <CodeBlock
                  title="CSS"
                  code={cssContent}
                  isCopied={isCssCopied}
                  onCopy={() => copyCss(cssContent)}
                />
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
