import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, X, Send, Lightbulb, BookOpen, Calculator } from "lucide-react";

interface AITutorChatProps {
  currentQuestion?: string;
  currentChoices?: string[];
  currentPassage?: string;
  section?: 'reading' | 'math';
  domain?: string;
  onClose: () => void;
}

export function AITutorChat({ 
  currentQuestion, 
  currentChoices, 
  currentPassage,
  section = 'reading',
  domain,
  onClose 
}: AITutorChatProps) {
  const [messages, setMessages] = useState<Array<{type: 'user' | 'ai', content: string}>>([
    {
      type: 'ai', 
      content: `Hi! I'm your AI tutor for ${section === 'reading' ? 'Reading & Writing' : 'Math'}. I can help you with this question by explaining concepts, providing strategy hints, or walking through the solution step-by-step. What would you like to know?`
    }
  ]);
  const [input, setInput] = useState("");

  // Quick action buttons for common requests
  const quickActions = [
    {
      label: "Explain the question",
      action: () => handleQuickAction("Can you explain what this question is asking for?")
    },
    {
      label: "Show strategy hints",
      action: () => handleQuickAction("What strategy should I use to solve this?")
    },
    {
      label: "Step-by-step solution",
      action: () => handleQuickAction("Can you walk me through this step by step?")
    },
    {
      label: "Common mistakes",
      action: () => handleQuickAction("What are common mistakes students make on this type of question?")
    }
  ];

  const handleQuickAction = (question: string) => {
    setInput(question);
    handleSend(question);
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // Context-aware responses based on question type and user input
    if (input.includes('explain') || input.includes('asking')) {
      return `This question is testing your understanding of ${domain || 'the main concept'}. Look for key words in the question that tell you what to find. In ${section === 'reading' ? 'reading questions' : 'math problems'}, always identify what the question is specifically asking for before looking at the answer choices.`;
    }
    
    if (input.includes('strategy') || input.includes('approach')) {
      if (section === 'reading') {
        return `For this type of question, try this strategy: 1) Read the question first to know what to look for, 2) Scan the passage for relevant information, 3) Eliminate obviously wrong answers, 4) Choose the best supported answer. Remember to look for evidence in the text!`;
      } else {
        return `For this math problem, try this approach: 1) Identify what you're solving for, 2) Write down what you know, 3) Choose the best method (algebra, substitution, etc.), 4) Check your work. Don't forget to use the calculator if needed!`;
      }
    }
    
    if (input.includes('step') || input.includes('walk')) {
      if (section === 'reading') {
        return `Let's break this down: 1) First, identify the main topic, 2) Look for supporting details in the passage, 3) Consider the author's purpose, 4) Match your answer to the evidence. The key is finding the best-supported answer, not just what sounds right.`;
      } else {
        return `Here's the step-by-step: 1) Identify the variables and what you need to find, 2) Set up the equation or relationship, 3) Solve step by step, 4) Check if your answer makes sense. Remember to show your work!`;
      }
    }
    
    if (input.includes('mistake') || input.includes('wrong')) {
      return `Common mistakes on this type of question include: 1) Rushing without reading carefully, 2) Choosing answers that sound good but aren't supported, 3) Not checking all answer choices, 4) Misinterpreting key words. Take your time and always verify your answer!`;
    }
    
    if (input.includes('help') || input.includes('stuck')) {
      return `Don't worry! Let's tackle this together. First, take a deep breath. Then, try to identify one thing you do understand about the question. Even if you're not sure of the answer, you can often eliminate some choices. What part is most confusing to you?`;
    }
    
    // Default response
    return `Great question! For ${section === 'reading' ? 'reading comprehension' : 'math problems'}, the key is to break it down into manageable parts. Try to identify what the question is asking, look for evidence or use the appropriate formula, and eliminate answer choices that don't fit. What specific part would you like me to help you with?`;
  };

  const handleSend = (customInput?: string) => {
    const messageToSend = customInput || input;
    if (!messageToSend.trim()) return;
    
    setMessages(prev => [...prev, {type: 'user', content: messageToSend}]);
    
    // Generate context-aware AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(messageToSend);
      setMessages(prev => [...prev, {type: 'ai', content: aiResponse}]);
    }, 1000);
    
    if (!customInput) {
      setInput("");
    }
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
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={action.action}
              className="text-xs h-8"
            >
              {action.label}
            </Button>
          ))}
        </div>

        {/* Chat Messages */}
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

        {/* Input Area */}
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about this question..."
            className="min-h-[40px] text-sm"
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
          />
          <Button size="sm" onClick={() => handleSend()} disabled={!input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}