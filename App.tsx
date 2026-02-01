
import React, { useState, useRef, useEffect } from 'react';
import Layout from './components/Layout';
import MessageBubble from './components/MessageBubble';
import EmergencyDisclaimer from './components/EmergencyDisclaimer';
import { geminiService } from './geminiService';
import { Message } from './types';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "أهلاً بك، أنا دكتور أورا. سأقوم بمساعدتك في فهم حالتك الصحية من خلال بضع أسئلة. \n\nما الذي تشكو منه في أسنانك اليوم؟",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      text: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      let fullResponse = "";
      // Initial placeholder for streaming
      setMessages(prev => [...prev, { role: 'model', text: '', timestamp: new Date() }]);

      await geminiService.sendMessageStream(userMessage.text, (chunk) => {
        fullResponse += chunk;
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage.role === 'model') {
            lastMessage.text = fullResponse;
          }
          return newMessages;
        });
      });
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage.role === 'model' && lastMessage.text === '') {
            lastMessage.text = "عذراً، حدث خطأ فني. يرجى المحاولة مرة أخرى.";
        }
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    "أشعر بألم شديد",
    "نزيف عند غسل الأسنان",
    "حساسية مع الحلويات",
    "كسر في أحد الأسنان"
  ];

  return (
    <Layout>
      <div className="flex-1 flex flex-col overflow-hidden bg-white sm:shadow-xl sm:my-4 sm:rounded-2xl">
        <EmergencyDisclaimer />
        
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 md:px-8">
          {messages.map((msg, index) => (
            <MessageBubble key={index} message={msg} />
          ))}
          {isLoading && messages[messages.length - 1].text === "" && (
            <div className="flex justify-start mb-6">
              <div className="bg-white border border-slate-100 rounded-2xl rounded-tr-none px-5 py-3 shadow-sm">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestions */}
        {messages.length < 3 && !isLoading && (
          <div className="px-4 py-2 flex flex-wrap gap-2 justify-center bg-slate-50 border-t border-slate-100">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => { setInputValue(s); }}
                className="text-xs bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full hover:border-teal-400 hover:text-teal-600 transition-colors shadow-sm"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100">
          <form onSubmit={handleSend} className="relative flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="اكتب ردك هنا..."
              disabled={isLoading}
              className="w-full pl-14 pr-4 py-4 bg-slate-100 border-none rounded-2xl text-sm focus:ring-2 focus:ring-teal-500 transition-all outline-none"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className={`absolute left-2 p-2.5 rounded-xl transition-all ${
                isLoading || !inputValue.trim() 
                  ? 'bg-slate-300 text-slate-100' 
                  : 'bg-teal-600 text-white hover:bg-teal-700 shadow-md active:scale-95'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
          <p className="text-[10px] text-center text-slate-400 mt-2">
            دكتور أورا سيطرح عليك أسئلة متتالية للوصول لأدق استشارة.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default App;
