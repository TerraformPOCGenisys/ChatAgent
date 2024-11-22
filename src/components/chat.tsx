import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { openai } from "@/lib/openai";
import aimodels from "@/AIModels";

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  isDefaultAssistantMessage?: boolean;
}

interface ChatProps {
  selectedModel: string;
  systemPrompt: string;
}

export function Chat({ selectedModel, systemPrompt }: Readonly<ChatProps>) {
  const modelDetails = aimodels.find((model) => model.name === selectedModel);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: modelDetails?.assistantPrompt ?? "Hello! How can I assist you today?",
      isDefaultAssistantMessage: true
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const modelDetails = aimodels.find((model) => model.name === selectedModel);
    setMessages([
      {
        role: "assistant",
        content: modelDetails?.assistantPrompt ?? "Hello! How can I assist you today?",
      },
    ]);
  }, [selectedModel]);

  const handleSend = async (message: string) => {
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setIsLoading(true);

    try {
      let assistantMessage = "";

      if (selectedModel === "Gemini") {
        const gemini_AIEndpoint = import.meta.env.GEN_GEMINI_AI_ENDPOINT;
        if (!gemini_AIEndpoint) {
          throw new Error("Custom AI endpoint not configured");
        }

        assistantMessage = await geminiPromptCompletions(gemini_AIEndpoint, message);
      } else {
        assistantMessage = await openAIChatCompletions(systemPrompt, messages, message);
      }
      
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: assistantMessage, isDefaultAssistantMessage: false }
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        { 
          role: "assistant", 
          content: "I apologize, but I encountered an error. Please check the API configuration.",
          isDefaultAssistantMessage: false 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="flex-1 min-h-0">
        <ScrollArea ref={scrollAreaRef} className="h-[calc(100vh-8.5rem)]">
          <div className="space-y-3 p-4">
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                message={message}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
      <div className="h-20 p-4 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <ChatInput selectedModel={selectedModel} onSend={handleSend} isLoading={isLoading} />
      </div>
    </div>
  );
}

async function openAIChatCompletions(systemPrompt: string, messages: Message[], message: string) {
  const response = await openai.chat.completions.create({
    model: "ft:gpt-4o-2024-08-06:personal:genecommerce-v5:AM6sf9Sg",
    messages: [
      { role: "system", content: systemPrompt },
      ...messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { role: "user", content: message }
    ]
  });

  return response.choices[0]?.message?.content ?? "I apologize, but I couldn't generate a response.";
}

async function geminiPromptCompletions(customAIEndpoint: string, message: string) {
  const response = await fetch(customAIEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: message
    })
  });
  
  const data = await response.json();
  return data.response['answer'];
}
