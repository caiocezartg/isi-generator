import { ModeToggle } from "./components/mode-toggle";
import { ThemeProvider } from "./components/theme-provider";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "./components/ui/toaster";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import ISIEmailForm from "./components/isi-email-form";
import ISIBannerForm from "./components/isi-banner-form";
import { OutputDisplay } from "./components/output-display"; 

import { useIsiStore } from './store/useIsiStore';
import { TabSync } from './components/tab-sync'; 

function App() {
  const { 
    activeTab, 
    setActiveTab, 
    generatedHtml, 
    generatedCss, 
    clearAll
  } = useIsiStore();

  const showOutput = generatedHtml || generatedCss;

  const handleTabChange = (value: string) => {
    if (value === 'email' || value === 'banner') {
      setActiveTab(value);
    }
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        <TabSync />

        <div className="bg-[var(--background)] flex min-h-screen flex-col items-center justify-center">
          <div className="fixed right-2 top-2">
            <ModeToggle />
          </div>

          <div className="container flex flex-col items-center justify-center px-4 py-8">
            <h1 className="mb-4 text-center text-2xl font-bold lg:text-4xl">
              ISI Generator
            </h1>
            <h3 className="mb-3 text-center font-light text-foreground">
              Below you can generate an ISI code just copying and pasting <br />{" "}
              a normal text with break lines
            </h3>

            <div className="flex w-full flex-col justify-center gap-6 md:flex-row">
              <div className={`w-full ${showOutput ? 'md:w-1/2' : ''}`}>
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