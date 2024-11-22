import { SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useRef, KeyboardEvent, useEffect } from "react";
import { Loader2 } from "lucide-react";
import aimodels from "@/AIModels";

interface ChatInputProps {
  selectedModel: string;
  onSend: (message: string) => void;
  isLoading?: boolean;
}

export function ChatInput({ selectedModel, onSend, isLoading }: ChatInputProps) {
  const [placeholder, setPlaceholder] = useState(aimodels[0].uiContext?.inputPlaceholder);
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const modelDetails = aimodels.find((model) => model.name === selectedModel);
    setPlaceholder(modelDetails?.uiContext?.inputPlaceholder ?? "Type your query here");
    setMessage("");
  }, [selectedModel]);

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSend(message);
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      // 2 rows * line-height (default 24px)
      textarea.style.height = `${Math.min(textarea.scrollHeight, 2 * 24)}px`;
    }
  };

  return (
    <div className="flex gap-2 items-end bg-background border shadow-sm"
      style={{
        borderRadius: "6px"
      }}>
      {/* <svg className="_PromptEffectContainer_1nqq4_1">
        <defs>
          <linearGradient id="line-gradient" x1="20%" y1="0%" x2="-14%" y2="50%" gradientTransform="rotate(-110)">
            <stop offset="0%" stop-color="#f10019" stop-opacity="0%">
            </stop>
            <stop offset="40%" stop-color="#f10019" stop-opacity="80%">
            </stop>
            <stop offset="50%" stop-color="#f10019" stop-opacity="80%">
            </stop>
            <stop offset="100%" stop-color="#f10019" stop-opacity="0%">
            </stop>
          </linearGradient>
          <linearGradient id="shine-gradient">
            <stop offset="0%" stop-color="white" stop-opacity="0%">
            </stop>
            <stop offset="40%" stop-color="#ff3f52" stop-opacity="80%">
            </stop>
            <stop offset="50%" stop-color="#ff3f52" stop-opacity="80%">
            </stop>
            <stop offset="100%" stop-color="white" stop-opacity="0%">
            </stop>
          </linearGradient>
        </defs>
        <rect className="_PromptEffectLine_1nqq4_10" pathLength="100" stroke-linecap="round"></rect>
        <rect className="_PromptShine_1nqq4_22" x="48" y="24" width="100" height="1"></rect>
      </svg> */}
      <Textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        placeholder={placeholder}
        className="min-h-[44px] resize-none border-0 focus-visible:ring-0 rounded-xl"
        rows={2}
        disabled={isLoading}
        style={{
          borderRadius: "6px",
          maxHeight: "calc(2 * 1.5em)", // 2 rows * line-height (1.5em is default)
        }}
      />
      <Button
        size="icon"
        onClick={handleSend}
        disabled={!message.trim() || isLoading}
        className="mb-1.5 mr-1.5"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <SendHorizontal className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}