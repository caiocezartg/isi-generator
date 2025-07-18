import { ModeToggle } from "./components/mode-toggle";
import { ThemeProvider } from "./components/theme-provider";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import ISIEmailForm from "./components/isi-email-form";
import ISIBannerForm from "./components/isi-banner-form";
import { OutputDisplay } from "./components/output-display";

import { useIsiStore } from "./store/use-isi-store";
import { TabSync } from "./components/tab-sync";

function App() {
  const { activeTab, setActiveTab, generatedHtml, generatedCss, clearAll } =
    useIsiStore();

  const showOutput = generatedHtml || generatedCss;

  const handleTabChange = (value: string) => {
    if (value === "email" || value === "banner") {
      setActiveTab(value);
      clearAll();
    }
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        <TabSync />

        <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] bg-[radial-gradient(ellipse_40%_70%_at_50%_-40%,_#e5e5e547,_#fff0)]">
          {/* <div className="absolute left-0 top-0 h-[80rem] w-[35rem] -translate-y-[350px] -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
          <div className="absolute left-0 top-0 h-[80rem] w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
          <div className="absolute left-0 top-0 h-[80rem] w-56 -translate-y-[350px] -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" /> */}
          <div className="fixed right-2 top-2">
            <ModeToggle />
          </div>

          <div className="container flex flex-col items-center justify-center px-4 py-8">
            <h1 className="mb-4 bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-center text-2xl font-bold text-transparent md:text-6xl">
              ISI Generator
            </h1>
            <h3 className="mb-3 text-center font-light text-foreground">
              Below you can generate an ISI code just copying and pasting <br />{" "}
              a normal text with break lines
            </h3>

            <div className="flex w-full flex-col justify-center gap-6 md:flex-row">
              <div
                className={`w-full ${showOutput ? "md:w-1/2" : "md:max-w-xl"}`}
              >
                <Tabs
                  value={activeTab}
                  onValueChange={handleTabChange}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="email">Email</TabsTrigger>
                    <TabsTrigger value="banner">Banner</TabsTrigger>
                  </TabsList>
                  <TabsContent value="email" className="mt-6">
                    <ISIEmailForm />
                  </TabsContent>
                  <TabsContent value="banner" className="mt-6">
                    <ISIBannerForm />
                  </TabsContent>
                </Tabs>
              </div>

              {showOutput && (
                <OutputDisplay
                  htmlContent={generatedHtml}
                  cssContent={generatedCss}
                  onClear={clearAll}
                />
              )}
            </div>
          </div>
        </div>
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
