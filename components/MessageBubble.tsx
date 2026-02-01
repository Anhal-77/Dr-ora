
import React from 'react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isModel = message.role === 'model';

  return (
    <div className={`flex w-full mb-6 ${isModel ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex max-w-[85%] ${isModel ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm mt-1
          ${isModel ? 'bg-teal-600 ml-3' : 'bg-slate-500 mr-3'}`}>
          {isModel ? 'أ' : 'أنت'}
        </div>
        <div className={`relative px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm
          ${isModel 
            ? 'bg-white text-slate-700 rounded-tr-none border border-slate-100' 
            : 'bg-teal-600 text-white rounded-tl-none'}`}>
          <div className="whitespace-pre-wrap">{message.text}</div>
          <div className={`text-[10px] mt-2 opacity-50 ${isModel ? 'text-slate-400' : 'text-teal-100'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
