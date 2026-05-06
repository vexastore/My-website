import React, { useEffect, useRef, useState } from 'react';
import { Bot, MessageSquare, Send, ShieldCheck, User, X } from 'lucide-react';
import { useShop } from '../context/ShopContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  time: string;
}

const now = () => new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

const isRtl = (text: string) => /[\u0600-\u06FF]/.test(text);

export const VexaAiAssistant: React.FC = () => {
  const { products } = useShop();
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: 'Hi, I am Vexa assistant. Ask me in Arabic or English about products, prices, delivery, privacy, or WhatsApp support.',
      sender: 'ai',
      time: now()
    }
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [messages, isTyping]);

  const getOpenAiKey = () => {
    const fromWindow = typeof window !== 'undefined'
      ? (window as Window & { VEXA_OPENAI_API_KEY?: string }).VEXA_OPENAI_API_KEY
      : '';
    const fromStorage = typeof localStorage !== 'undefined'
      ? localStorage.getItem('vexa_openai_api_key')
      : '';

    return (fromWindow || fromStorage || 'YOUR_API_KEY_HERE').trim();
  };

  const localAssistantReply = (userText: string) => {
    const query = userText.toLowerCase();

    const matchedProducts = products.filter((product) => (
      product.name.toLowerCase().includes(query) ||
      product.nameEn.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    ));

    if (matchedProducts.length > 0 && query.length > 2) {
      return matchedProducts.slice(0, 3).map((product) => (
        `${product.nameEn}\nPrice: $${product.price.toFixed(2)} USD\nStock: ${product.stock} left\n${product.descriptionEn}`
      )).join('\n\n');
    }

    if (['delivery', 'shipping', 'beirut', 'توصيل', 'شحن', 'بيروت', 'دليفري'].some((word) => query.includes(word))) {
      return 'Same-day delivery is available in Beirut. All orders are packed in a plain sealed box with full privacy. Payment is cash on delivery.';
    }

    if (['privacy', 'discreet', 'secret', 'خصوصية', 'سري', 'مخفي'].some((word) => query.includes(word))) {
      return 'Your privacy is fully protected. Packaging is plain, sealed, and does not show the store name or product details.';
    }

    if (['whatsapp', 'واتساب', 'تواصل'].some((word) => query.includes(word))) {
      return 'You can contact Vexa support on WhatsApp through the green button on the page. Our working hours are Monday to Saturday, 8:00 AM to 6:00 PM.';
    }

    if (['lingerie', 'لانجري', 'wife', 'زوجتي'].some((word) => query.includes(word))) {
      return 'For lingerie, I recommend checking the Lingerie collection. We have satin, lace, and premium soft-fit sets. Delivery is discreet and payment is on delivery.';
    }

    if (['men', 'male', 'رجال', 'رجالي', 'زوجي'].some((word) => query.includes(word))) {
      return 'For men, check the Male Toys collection. We have products designed for comfort, stamina, and private use. Ask me about a specific product and I can help.';
    }

    return 'Tell me what you are looking for, and I will help you choose. You can ask about products, prices, delivery, privacy, or payment.';
  };

  const callOpenAiAssistant = async (userText: string, history: Message[]) => {
    const apiKey = getOpenAiKey();

    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
      return localAssistantReply(userText);
    }

    const catalog = products.map((product) => (
      `${product.name} | ${product.nameEn} | ${product.category} | $${product.price.toFixed(2)} USD | stock: ${product.stock} | ${product.descriptionEn}`
    )).join('\n');

    const recentMessages = history.slice(-8).map((message) => ({
      role: message.sender === 'user' ? 'user' : 'assistant',
      content: message.text
    }));

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are the smart sales assistant for Vexa Store. Reply naturally in the same language as the user, Arabic or English. Be concise, friendly, and helpful like a real WhatsApp assistant. Help with products, prices, stock, discreet packaging, cash on delivery, WhatsApp support, same-day delivery in Beirut, and working hours Monday to Saturday 8 AM to 6 PM. Never ask for online payment. Use this catalog as truth:\n' + catalog
          },
          ...recentMessages,
          { role: 'user', content: userText }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const data: { choices?: Array<{ message?: { content?: string } }> } = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || localAssistantReply(userText);
  };

  const sendMessage = async () => {
    const text = inputText.trim();
    if (!text || isTyping) return;

    const userMessage: Message = {
      id: crypto.randomUUID?.() || String(Date.now()),
      text,
      sender: 'user',
      time: now()
    };

    const previousMessages = messages;
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const reply = await callOpenAiAssistant(text, previousMessages);
      setMessages((prev) => [...prev, {
        id: crypto.randomUUID?.() || String(Date.now() + 1),
        text: reply,
        sender: 'ai',
        time: now()
      }]);
    } catch (error) {
      console.error('AI Error:', error);
      setMessages((prev) => [...prev, {
        id: crypto.randomUUID?.() || String(Date.now() + 1),
        text: localAssistantReply(text),
        sender: 'ai',
        time: now()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="font-sans" dir="ltr">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 z-[9999] flex h-16 w-16 items-center justify-center rounded-full bg-black text-white shadow-2xl shadow-black/50 transition hover:scale-105 active:scale-95 sm:h-20 sm:w-20"
        aria-label="Open AI assistant"
      >
        <span className="absolute -left-1 -top-1 h-4 w-4 rounded-full bg-[#02d21e] ring-[3px] ring-[#070707]" />
        <MessageSquare size={36} strokeWidth={1.6} />
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-4 z-[9999] flex h-[560px] w-[calc(100%-2rem)] max-w-[420px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#101010] shadow-2xl shadow-black/70">
          <div className="flex items-center justify-between border-b border-white/10 bg-black px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="text-sm font-black tracking-wide">Vexa AI</h3>
                <p className="flex items-center gap-1 text-[10px] font-bold text-white/50">
                  <ShieldCheck size={11} /> Private sales assistant
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
              aria-label="Close AI assistant"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto bg-[#f5f5f5] px-4 py-4">
            {messages.map((message) => {
              const rtl = isRtl(message.text);
              const isUser = message.sender === 'user';

              return (
                <div key={message.id} className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
                  {!isUser && (
                    <div className="mb-5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black text-white">
                      <Bot size={14} />
                    </div>
                  )}

                  <div className={`max-w-[82%] ${isUser ? 'text-right' : 'text-left'}`} dir={rtl ? 'rtl' : 'ltr'}>
                    <div className={`whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
                      isUser
                        ? 'rounded-br-md bg-black text-white'
                        : 'rounded-bl-md bg-white text-neutral-900'
                    }`}>
                      {message.text}
                    </div>
                    <div className={`mt-1 text-[10px] text-neutral-400 ${rtl ? 'text-right' : isUser ? 'text-right' : 'text-left'}`}>
                      {message.time}
                    </div>
                  </div>

                  {isUser && (
                    <div className="mb-5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-300 text-neutral-700">
                      <User size={14} />
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-end gap-2">
                <div className="mb-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black text-white">
                  <Bot size={14} />
                </div>
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-sm">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-400" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-400 [animation-delay:120ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-400 [animation-delay:240ms]" />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage();
            }}
            className="flex items-center gap-2 border-t border-white/10 bg-white px-3 py-3"
          >
            <input
              value={inputText}
              onChange={(event) => setInputText(event.target.value)}
              disabled={isTyping}
              placeholder="Type a message... / اكتب رسالتك"
              className="min-w-0 flex-1 rounded-full border border-neutral-200 bg-neutral-100 px-4 py-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
              aria-label="Send message"
            >
              <Send size={17} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};