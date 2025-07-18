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
import { motion } from "motion/react";

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

        <motion.div
          initial={{ opacity: 0, filter: "blur(8px)", y: -40 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 0.7, delay: 0 }}
          className="flex min-h-screen flex-col items-center justify-center overflow-x-hidden bg-[var(--background)] bg-[radial-gradient(ellipse_70%_20%_at_50%_-10%,_#e5e5e547,_#fff0)] md:bg-[radial-gradient(ellipse_40%_70%_at_50%_-40%,_#e5e5e547,_#fff0)]"
        >
          <motion.div
            initial={{ opacity: 0, filter: "blur(8px)", x: 40 }}
            animate={{ opacity: 1, filter: "blur(0px)", x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="fixed right-2 top-2"
          >
            <ModeToggle />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, filter: "blur(8px)", y: -40 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="container flex flex-col items-center justify-center px-4 py-8"
          >
            <motion.h1
              initial={{ opacity: 0, filter: "blur(8px)", y: -30 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mb-4 bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-center text-2xl font-bold text-transparent md:text-6xl"
            >
              ISI Generator
            </motion.h1>
            <motion.h3
              initial={{ opacity: 0, filter: "blur(8px)", y: 30 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mb-3 text-center font-light text-foreground"
            >
              Below you can generate an ISI code just copying and pasting <br />{" "}
              a normal text with break lines
            </motion.h3>

            <motion.div
              initial={{ opacity: 0, filter: "blur(8px)", x: -40 }}
              animate={{ opacity: 1, filter: "blur(0px)", x: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex w-full flex-col justify-center gap-6 md:flex-row"
            >
              <motion.div
                initial={{ opacity: 0, filter: "blur(8px)", x: -40 }}
                animate={{ opacity: 1, filter: "blur(0px)", x: 0 }}
                transition={{ duration: 0.7, delay: 0.6 }}
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
              </motion.div>

              {showOutput && (
                <motion.div
                  initial={{ opacity: 0, filter: "blur(8px)", x: 40 }}
                  animate={{ opacity: 1, filter: "blur(0px)", x: 0 }}
                  transition={{ duration: 0.7 }}
                  className="w-full md:w-1/2"
                >
                  <OutputDisplay
                    htmlContent={generatedHtml}
                    cssContent={generatedCss}
                    onClear={clearAll}
                  />
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
