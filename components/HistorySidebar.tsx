import React from 'react';
import { type ChatSession } from '../types.ts';
import { PlusIcon } from './icons/PlusIcon.tsx';
import { LogoutIcon } from './icons/LogoutIcon.tsx';
import { TrashIcon } from './icons/TrashIcon.tsx';
import { LogoIcon } from './icons/LogoIcon.tsx';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  chatHistory: ChatSession[];
  activeChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  onLogout: () => void;
  isAuthenticated: boolean;
  onSignUp: () => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({
  isOpen,
  onClose,
  chatHistory,
  activeChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onLogout,
  isAuthenticated,
  onSignUp,
}) => {
  return (
    <>
      <aside
        className={`fixed md:relative md:translate-x-0 inset-y-0 left-0 z-30 w-72 bg-surface border-r border-surface-border transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out flex flex-col`}
      >
        <div className="p-4 border-b border-surface-border flex justify-between items-center">
          <div className="flex items-center gap-2">
            <LogoIcon className="w-8 h-8 text-brand-orange"/>
            <span className="font-bold text-foreground">Chat History</span>
          </div>
        </div>
        
        <div className="p-2">
            <button
            onClick={onNewChat}
            disabled={!isAuthenticated}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-lg brand-cta font-bold"
            >
            <PlusIcon />
            New Chat
            </button>
        </div>
        

        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          {isAuthenticated ? (
            chatHistory.map((chat) => (
              <div key={chat.id} className="group flex items-center">
                <button
                  onClick={() => onSelectChat(chat.id)}
                  className={`w-full text-left p-2.5 rounded-lg truncate text-sm font-medium ${
                    activeChatId === chat.id
                      ? 'bg-brand-orange-dark-accessible text-white font-bold'
                      : 'hover:bg-background text-foreground/80'
                  }`}
                >
                  {chat.title}
                </button>
                <button 
                  onClick={(e) => {
                      e.stopPropagation();
                      onDeleteChat(chat.id)
                  }}
                  className="p-1 rounded-md text-foreground/40 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-500/10 ml-1 flex-shrink-0"
                  aria-label="Delete chat"
                >
                  <TrashIcon />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center text-sm text-foreground/50 p-4">
              Sign up to save and view your chat history.
            </div>
          )}
        </nav>
        
        <div className="p-2 border-t border-surface-border">
            {isAuthenticated ? (
              <button onClick={onLogout} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-background text-foreground/80 text-sm font-medium">
                  <LogoutIcon />
                  <span>Logout</span>
              </button>
            ) : (
              <div className="space-y-2">
                <button onClick={onSignUp} className="w-full flex items-center justify-center gap-3 p-3 rounded-lg brand-cta text-white text-sm font-bold">
                    <span>Sign Up</span>
                </button>
                <button onClick={onLogout} className="w-full flex items-center justify-center gap-3 p-2 rounded-lg hover:bg-background text-sm text-foreground/60">
                  <LogoutIcon className="w-4 h-4" />
                  <span>Exit Guest Mode</span>
                </button>
              </div>
            )}
        </div>
      </aside>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={onClose}
        ></div>
      )}
    </>
  );
};

export default HistorySidebar;