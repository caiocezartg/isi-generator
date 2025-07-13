import { Button } from "./ui/button";
import { Smartphone, Monitor } from "lucide-react";
import { useState } from "react";

interface PreviewProps {
  htmlContent: string;
  cssContent: string;
}

export function Preview({ htmlContent, cssContent }: PreviewProps) {
  const [view, setView] = useState<"desktop" | "mobile">("desktop");

  if (!htmlContent || !cssContent) {
    return (
      <p className="text-sm text-red-500">
        Invalid HTML or CSS content provided.
      </p>
    );
  }

  const srcDoc = `
    <html>
      <head>
        <style>
          body { margin: 0; font-family: sans-serif; }
          ${cssContent}
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>
  `;

  const iframeWidth = {
    desktop: "100%",
    mobile: "375px",
  };

  const iframeMaxWidth = {
    desktop: "600px",
    mobile: "375px",
  };

  return (
    <div className="flex w-full flex-col">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-bold">Preview</p>
        <div className="flex gap-1">
          <Button
            variant={view === "desktop" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setView("desktop")}
            title="Desktop View"
            className="h-8 w-8"
          >
            <Monitor size={16} />
          </Button>
          <Button
            variant={view === "mobile" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setView("mobile")}
            title="Mobile View"
            className="h-8 w-8"
          >
            <Smartphone size={16} />
          </Button>
        </div>
      </div>
      <div className="flex-1 rounded-md border-2 p-2">
        <iframe
          srcDoc={srcDoc}
          title="ISI Preview"
          sandbox="allow-scripts"
          className="h-[400px] w-full transition-all duration-300 ease-in-out md:h-full"
          style={{
            width: iframeWidth[view],
            maxWidth: iframeMaxWidth[view],
            margin: "0 auto",
          }}
        />
      </div>
    </div>
  );
}
