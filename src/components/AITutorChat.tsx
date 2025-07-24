import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, X, Send } from "lucide-react";

interface AITutorChatProps {
  currentQuestion?: string;
  currentChoices?: string[];
  onClose: () => void;
}

export function AITutorChat({ currentQuestion, currentChoices, onClose }: AITutorChatProps) {
  const [messages, setMessages] = useState<Array<{type: 'user' | 'ai', content: string}>>([
    {type: 'ai', content: "Hi! I'm your AI tutor. Ask me anything about this question - why an answer is wrong, how to approach the problem, or request a step-by-step explanation!"}
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, {type: 'user', content: input}]);
    
    // Simple mock AI response - in a real app, this would call an AI service
    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'ai', 
        content: `Great question! Let me help you with that. ${input.toLowerCase().includes('why') ? 'The key is to look for context clues and eliminate answers that don\'t match the passage\'s tone.' : 'Try breaking this down step by step - identify what the question is asking, then look for supporting evidence in the passage.'}`
      }]);
    }, 1000);
    
    setInput("");
  };

  return (
    <Card className="fixed bottom-20 right-4 w-80 max-h-96 shadow-glow border border-primary/20 z-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            AI Tutor
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="max-h-48 overflow-y-auto space-y-2">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg text-sm ${
                message.type === 'user'
                  ? 'bg-primary text-primary-foreground ml-4'
                  : 'bg-muted mr-4'
              }`}
            >
              {message.content}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about this question..."
            className="min-h-[40px] text-sm"
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
          />
          <Button size="sm" onClick={handleSend} disabled={!input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}