import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { ModelSelector } from "@/components/model-selector";
import { Chat } from "@/components/chat";
import { SystemPrompt } from "@/components/system-prompt";
import { CircleDot, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import { cn } from "./lib/utils";
import aimodels from './AIModels';

function App() {
  const [selectedModel, setSelectedModel] = useState(aimodels[0]?.name);
  const [systemPrompt, setSystemPrompt] = useState(aimodels[0].systemPrompt ?? '');
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => {
    const modelDetails = aimodels.find((model) => model.name === selectedModel);
    if (modelDetails) {
      document.title = modelDetails.displayName;
    }
  }, [selectedModel]);

  return (
    <ThemeProvider defaultTheme="system" storageKey="app-theme">
      <div className="flex flex-col h-screen">
        <header className="flex h-14 items-center px-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-2">
            <CircleDot className="h-6 w-6 rainbow-stroke animate-pulse" />
            <div>
              <h1 className="font-semibold text-lg leading-none">Genisys T-Sense</h1>
              <p className="text-xs text-muted-foreground leading-none mt-0.5">Online and ready</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <ModelSelector aimodels={aimodels} value={selectedModel} onValueChange={setSelectedModel} />
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 flex">
          <div className={cn(
            "border-r transition-all duration-300 ease-in-out flex flex-col",
            isPanelOpen ? "w-[300px]" : "w-[40px]"
          )}>
            <div className={cn(
              "flex-1 transition-opacity duration-300",
              isPanelOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            )}>
              <SystemPrompt 
                selectedModel={selectedModel}
                onSystemPromptChange={setSystemPrompt}
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsPanelOpen(false)}
            >
              {isPanelOpen ? (
                <PanelLeftClose className="h-4 w-4" />
              ) : (
                <PanelLeftOpen className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="w-[60%]">
              <Chat selectedModel={selectedModel} systemPrompt={systemPrompt} />
            </div>
          </div>
        </main>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;