import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Globe } from 'lucide-react';

const ChatInterface = () => {
    const [messages, setMessages] = useState([
        { id: 1, text: "Namaste! I'm BabySarthi. I can search Wikipedia to help answer your baby care questions.", sender: 'ai' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const getWikipediaData = async (query) => {
        try {
            // Search for the page
            const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;
            const searchRes = await fetch(searchUrl);
            const searchData = await searchRes.json();
            
            if (!searchData.query?.search?.length) return null;

            const bestPage = searchData.query.search[0];
            const pageId = bestPage.pageid;

            // Get content and images
            // piprop=thumbnail&pithumbsize=500 -> Get thumbnail image up to 500px
            const contentUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts|pageimages&pageids=${pageId}&exintro=true&explaintext=true&piprop=thumbnail&pithumbsize=500&format=json&origin=*`;
            const contentRes = await fetch(contentUrl);
            const contentData = await contentRes.json();
            
            const page = contentData.query.pages[pageId];
            
            return { 
                title: bestPage.title, 
                summary: page.extract,
                imageUrl: page.thumbnail ? page.thumbnail.source : null 
            };
        } catch (e) {
            console.error("Wikipedia fetch failed:", e);
            return null;
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setIsTyping(true);
        const userInput = input;
        setInput('');

        try {
            const wikiData = await getWikipediaData(userInput);
            
            let aiMsg;

            if (wikiData) {
                aiMsg = {
                    id: Date.now() + 1,
                    sender: 'ai',
                    text: wikiData.summary,
                    title: wikiData.title,
                    image: wikiData.imageUrl,
                    source: `Wikipedia: ${wikiData.title}`
                };
            } else {
                aiMsg = {
                    id: Date.now() + 1,
                    sender: 'ai',
                    text: "I couldn't find any specific information on that topic in my database (Wikipedia). Please try asking in a different way or consult a doctor."
                };
            }

            setMessages(prev => [...prev, aiMsg]);

        } catch (err) {
            setMessages(prev => [...prev, { id: Date.now() + 1, text: "Sorry, I encountered a network error. Please try again.", sender: 'ai', isError: true }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex flex-col h-[75vh] animate-in fade-in duration-500 relative">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex items-end gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-slate-800 text-white' : 'bg-teal-100 text-teal-600'}`}>
                                {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
                            </div>
                            <div className="flex flex-col gap-1 w-full">
                                <div
                                    className={`p-4 rounded-2xl text-sm font-medium leading-relaxed overflow-hidden ${msg.sender === 'user'
                                            ? 'bg-slate-800 text-white rounded-tr-none'
                                            : msg.isError 
                                                ? 'bg-rose-50 text-rose-600 border border-rose-100 rounded-tl-none'
                                                : 'bg-white border border-slate-100 text-slate-600 shadow-sm rounded-tl-none'
                                        }`}
                                >
                                    {msg.title && <h4 className="font-bold text-lg mb-2 text-teal-700">{msg.title}</h4>}
                                    
                                    {msg.image && (
                                        <img 
                                            src={msg.image} 
                                            alt={msg.title} 
                                            className="w-full h-48 object-cover rounded-xl mb-3 border border-slate-100"
                                        />
                                    )}

                                    {msg.text}
                                </div>
                                {msg.source && (
                                    <div className="flex items-center gap-1 text-[10px] text-teal-600 font-bold px-1 animate-in fade-in">
                                        <Globe size={10} /> {msg.source}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="flex items-end gap-2">
                            <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                                <Bot size={14} />
                            </div>
                            <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 bg-white/50 backdrop-blur-md border-t border-white/50">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Search specific topics (e.g. 'Colic', 'Teething')..."
                        className="w-full bg-white border-2 border-slate-100 focus:border-teal-500 rounded-2xl py-4 pl-4 pr-14 shadow-sm outline-none transition-all font-medium text-slate-700"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isTyping}
                        className="absolute right-2 p-2 bg-teal-500 hover:bg-teal-600 text-white rounded-xl transition-all disabled:opacity-50 disabled:bg-slate-300"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatInterface;
