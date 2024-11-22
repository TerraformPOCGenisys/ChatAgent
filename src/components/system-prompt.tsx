import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import aimodels from "@/AIModels";

interface SystemPromptProps {
  selectedModel: string;
  onSystemPromptChange: (prompt: string) => void;
}

export function SystemPrompt({ selectedModel, onSystemPromptChange }: Readonly<SystemPromptProps>) {
  const [prompt, setPrompt] = useState(aimodels.find((model) => model.name === selectedModel)?.systemPrompt);
  const { toast } = useToast();

  useEffect(() => {
    const modelDetails = aimodels.find((model) => model.name === selectedModel);
    setPrompt(modelDetails?.systemPrompt);
  }, [selectedModel]);

  const handlePromptChange = (value: string) => {
    setPrompt(value);
    onSystemPromptChange(value);
    toast({
      description: "System prompt updated successfully",
      duration: 2000,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-base">System Prompt</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={prompt}
          // onChange={(e) => handlePromptChange(e.target.value)}
          placeholder="Enter system prompt..."
          className="min-h-[200px] resize-none"
        />
        <Button 
          variant="outline" 
          size="sm"
          className="mt-2"
          onClick={() => handlePromptChange(prompt ?? '')}
        >
          Reset to Default
        </Button>
      </CardContent>
    </Card>
  );
}