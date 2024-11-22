import { cn } from "@/lib/utils";
import { Bot, User, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Message } from "./chat";
import showdown from "showdown";
import DOMPurify from "dompurify";

interface ChatMessageProps {
  message:Message
}

export function ChatMessage({ message }: Readonly<ChatMessageProps>) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const converter = new showdown.Converter();
  const rawHTMLContent = converter.makeHtml(message.content);
  const sanitizedHtml = DOMPurify.sanitize(rawHTMLContent);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      toast({
        description: "Message copied to clipboard",
        duration: 2000,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        description: `Failed to copy message${err}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className={cn("flex w-full gap-2",
      message.role === "user" ? "flex-row-reverse" : "flex-row"
    )}>
      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow bg-background">
        {message.role === "assistant" ? (
          <Bot className="h-4 w-4 bot-svg-stroke" />
        ) : (
          <User className="h-4 w-4 user-svg-stroke" />
        )}
      </div>
      <div className="flex flex-col gap-1.5 max-w-[80%]">
        <div className={cn(
          "px-3 py-1.5 text-sm",
          message.role === "user" 
            ? "bg-muted rounded-2xl" 
            : "prose prose-neutral dark:prose-invert"
        )}
         dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
         />
        {message.role === "assistant" && message.isDefaultAssistantMessage === false && (
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:bg-muted"
              onClick={copyToClipboard}
            >
              {copied ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
              <span className="sr-only">Copy message</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}