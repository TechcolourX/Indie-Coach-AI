import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, GenerateContentResponse, Part, Content } from '@google/genai';
import { type Message, Role, type ChatSession, type User, AppPart, TextPart, FilePart } from './types.ts';
import { SYSTEM_INSTRUCTION, TOPIC_SUGGESTIONS, TOOL_SUGGESTIONS } from './constants.tsx';
import Header from './components/Header.tsx';
import ChatMessage from './components/ChatMessage.tsx';
import ChatInput from './components/ChatInput.tsx';
import TopicButton from './components/TopicButton.tsx';
import { LoadingIcon } from './components/icons/LoadingIcon.tsx';
import HistorySidebar from './components/HistorySidebar.tsx';
import SignUpBanner from './components/SignUpBanner.tsx';
import SignUpModal from './components/SignUpModal.tsx';
import LoginModal from './components/LoginModal.tsx';
import Auth from './components/Auth.tsx';
import FollowUpPrompts from './components/FollowUpPrompts.tsx';
import { SparklesIcon } from './components/icons/SparklesIcon.tsx';
import { PaintBrushIcon } from './components/icons/PaintBrushIcon.tsx';

const RECOVERY_SESSION_KEY = 'merch-muse-ai-recovery-data';

// Helper function to get the API key safely, preventing a startup ReferenceError.
const getApiKey = (): string => {
  if (typeof process === 'undefined' || !process.env || !process.env.API_KEY) {
    throw new Error("[GoogleGenerativeAI Error]: API key not found. Please check your environment configuration.");
  }
  return process.env.API_KEY;
};

// Helper function to convert a File to a Base64 string
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            const base64Data = result.split(',')[1];
            resolve(base64Data);
        };
        reader.onerror = (error) => reject(error);
    });
};

// Helper to convert internal AppPart[] to SDK-compatible Part[]
const appPartsToApiParts = (parts: AppPart[]): Part[] => {
    return parts.map(part => {
        if (part.type === 'text') {
            return { text: part.text };
        }
        return { inlineData: { mimeType: part.file.mimeType, data: part.file.data }};
    });
};

// Helper to convert the app's message history to the SDK's Content[] format
const appMessagesToApiContents = (messages: Message[]): Content[] => {
    return messages.map(msg => ({
        role: msg.role,
        parts: appPartsToApiParts(msg.parts)
    }));
};

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [view, setView] = useState<'auth' | 'chat'>('auth');
  const [followUpPrompts, setFollowUpPrompts] = useState<string[]>([]);
  const [guestMessageCount, setGuestMessageCount] = useState<number>(() => {
    const savedUser = localStorage.getItem('merch-muse-ai-active-user');
    if (savedUser) return 0;
    const count = sessionStorage.getItem('guestMessageCount');
    return count ? parseInt(count, 10) : 0;
  });

  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const authenticateUser = useCallback((userData: User, guestMessages: Message[] = []) => {
    setIsAuthenticated(true);
    setUser(userData);
    setView('chat');

    const savedHistory = localStorage.getItem(`merch-muse-ai-history-${userData.email}`);
    let parsedHistory: ChatSession[] = [];
    if (savedHistory) {
      try {
        const historyData = JSON.parse(savedHistory);
        if (Array.isArray(historyData)) {
          parsedHistory = historyData;
        }
      } catch (e) {
        console.error("Failed to parse chat history from localStorage, resetting.", e);
      }
    }
    
    setChatHistory(parsedHistory);
    
    if (guestMessages.length > 0) {
        const firstUserMessage = guestMessages.find(m => m.role === Role.User);
        const textPart = firstUserMessage?.parts.find(p => p.type === 'text') as TextPart | undefined;
        const filePart = firstUserMessage?.parts.find(p => p.type === 'file') as FilePart | undefined;
        const title = textPart?.text.substring(0, 40) || filePart?.file.name.substring(0, 40) || 'Imported Chat';

        const newChatSession: ChatSession = {
            id: Date.now().toString(),
            title,
            messages: guestMessages,
        };
        parsedHistory = [newChatSession, ...parsedHistory];
        setChatHistory(parsedHistory);
        setMessages(guestMessages);
        setActiveChatId(newChatSession.id);
        return;
    }

    // Check for session recovery data
    const recoveryDataString = sessionStorage.getItem(RECOVERY_SESSION_KEY);
    if (recoveryDataString) {
        try {
            const recoveryData = JSON.parse(recoveryDataString);
            if (recoveryData.messages && recoveryData.activeChatId && parsedHistory.some((chat: ChatSession) => chat.id === recoveryData.activeChatId)) {
                setActiveChatId(recoveryData.activeChatId);
                setMessages(recoveryData.messages);
                setFollowUpPrompts([]);
                return;
            }
        } catch(e) { console.error("Failed to parse recovery data", e); }
    }
    
    // Default for authenticated users: start with a fresh chat screen
    setActiveChatId(null);
    setMessages([]);

  }, []);


  useEffect(() => {
    const activeUserString = localStorage.getItem('merch-muse-ai-active-user');
    if (activeUserString) {
      try {
        const activeUser = JSON.parse(activeUserString);
        if (activeUser && activeUser.email) {
            authenticateUser(activeUser);
        } else {
            throw new Error("Parsed user data is invalid.");
        }
      } catch (e) {
        console.error("Failed to parse active user from localStorage, logging out.", e);
        localStorage.removeItem('merch-muse-ai-active-user');
        setView('auth');
      }
    } else {
        // Handle guest session recovery
        const recoveryDataString = sessionStorage.getItem(RECOVERY_SESSION_KEY);
        if (recoveryDataString) {
             try {
                const recoveryData = JSON.parse(recoveryDataString);
                if (recoveryData.messages && !recoveryData.activeChatId) { // Check it's a guest session
                    setMessages(recoveryData.messages);
                    setFollowUpPrompts([]);
                    setView('chat');
                }
             } catch(e) { console.error("Failed to parse guest recovery data", e); }
        }
    }
  }, [authenticateUser]);
  
  // Effect for saving session for crash recovery
  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      const recoveryData = {
        activeChatId: isAuthenticated ? activeChatId : null,
        messages: messages,
      };
      sessionStorage.setItem(RECOVERY_SESSION_KEY, JSON.stringify(recoveryData));
    }
  }, [messages, activeChatId, isAuthenticated, isLoading]);

  useEffect(() => {
    if (isAuthenticated && user) {
      const historyToSave = chatHistory.map(session => ({
        ...session,
        messages: session.messages.map(message => ({
            ...message,
            parts: message.parts.map(part => {
                if (part.type === 'file') {
                    const { data, ...restOfFile } = part.file;
                    return { ...part, file: restOfFile };
                }
                return part;
            })
        }))
      }));
      localStorage.setItem(`merch-muse-ai-history-${user.email}`, JSON.stringify(historyToSave));
    }
  }, [chatHistory, isAuthenticated, user]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove