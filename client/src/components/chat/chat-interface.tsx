import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Mic, Bot, User } from "lucide-react";
import { ChatMessage } from "@/types";
import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

interface ChatInterfaceProps {
  country: string;
  user: any;
}

export function ChatInterface({ country, user }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      content: "¡Hola! Soy tu asistente legal. Puedes hacerme cualquier pregunta sobre leyes, derechos o procesos legales. ¿En qué puedo ayudarte hoy?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const askMutation = useMutation({
    mutationFn: api.askQuestion,
    onSuccess: (data) => {
      const aiMessage: ChatMessage = {
        id: Date.now().toString(),
        content: data.answer || "Lo siento, no pude procesar tu consulta en este momento.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    },
    onError: () => {
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        content: "Lo siento, ocurrió un error al procesar tu consulta. Por favor intenta nuevamente.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    },
  });

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    askMutation.mutate({ question: inputValue, country });
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "¿Cuáles son mis derechos laborales básicos?",
    "¿Cómo inicio un proceso de divorcio?",
    "¿Qué necesito para crear un contrato?",
    "¿Cómo presentar una demanda?",
  ];

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: question,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    askMutation.mutate({ question, country });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Chat Interface */}
      <div className="lg:col-span-2">
        <Card className="h-96 flex flex-col">
          {/* Chat Header */}
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary text-white">
                  <Bot className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-neutral-900">Asistente Legal IA</h3>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-xs text-green-500">En línea</p>
                </div>
              </div>
            </div>
          </CardHeader>

          {/* Chat Messages */}
          <CardContent className="flex-1 overflow-y-auto space-y-4 p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.sender === "user" ? "justify-end" : ""
                }`}
              >
                {message.sender === "ai" && (
                  <Avatar className="w-6 h-6 flex-shrink-0">
                    <AvatarFallback className="bg-primary text-white">
                      <Bot className="w-3 h-3" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-2xl p-3 max-w-sm ${
                    message.sender === "user"
                      ? "bg-primary text-white rounded-tr-sm"
                      : "bg-neutral-100 text-neutral-800 rounded-tl-sm"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
                {message.sender === "user" && (
                  <Avatar className="w-6 h-6 flex-shrink-0">
                    <AvatarFallback className="bg-primary text-white">
                      <User className="w-3 h-3" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {askMutation.isPending && (
              <div className="flex items-start space-x-3">
                <Avatar className="w-6 h-6 flex-shrink-0">
                  <AvatarFallback className="bg-primary text-white">
                    <Bot className="w-3 h-3" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-neutral-100 rounded-2xl rounded-tl-sm p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Chat Input */}
          <div className="p-4 border-t">
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu consulta legal aquí..."
                  className="pr-12"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2"
                  onClick={() => alert("Funcionalidad de voz en desarrollo")}
                >
                  <Mic className="w-4 h-4" />
                </Button>
              </div>
              <Button onClick={handleSendMessage} disabled={askMutation.isPending}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Quick Topics */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-neutral-900">Temas Frecuentes</h3>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickQuestions.map((question, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full text-left justify-start h-auto p-2 text-sm text-neutral-700"
                onClick={() => handleQuickQuestion(question)}
              >
                {question}
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Legal Resources */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-neutral-900">Recursos Legales</h3>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-3 p-2 bg-neutral-50 rounded-lg">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">Constitución Nacional</p>
                <p className="text-xs text-neutral-500">Actualizada 2024</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-2 bg-neutral-50 rounded-lg">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Scale className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">Código Civil</p>
                <p className="text-xs text-neutral-500">Reforma reciente</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
