import React from 'react';
import { type Message, Role, type User, TextPart, FilePart } from '../types.ts';
import { LogoIcon } from './icons/LogoIcon.tsx';
import EnhancedMarkdown from './EnhancedMarkdown.tsx';
import UserAvatar from './UserAvatar.tsx';
import { FileIcon } from './icons/FileIcon.tsx';

interface ChatMessageProps {
  message: Message;
  user: User | null;
  isStreaming?: boolean;
}

const FileAttachment: React.FC<{ file: { name: string; type: string } }> = ({ file }) => (
    <div className="mt-2 p-2.5 bg-black/10 dark:bg-white/10 rounded-lg border border-white/20">
        <div className="flex items-center gap-2">
            <FileIcon className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium truncate">{file.name}</span>
        </div>
    </div>
);

const ChatMessage: React.FC<ChatMessageProps> = ({ message, user, isStreaming }) => {
  const isUser = message.role === Role.User;

  const bubbleClasses = isUser
    ? 'bg-brand-orange-dark-accessible text-white'
    : 'bg-surface border border-surface-border text-foreground';
  
  const containerClasses = isUser 
    ? 'justify-end' 
    : 'justify-start';

  const formattedTime = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
      })
    : null;
    
  const textParts = message.parts.filter(p => p.type === 'text') as TextPart[];
  const fileParts = message.parts.filter(p => p.type === 'file') as FilePart[];
  const combinedText = textParts.map(p => p.text).join('\n');

  return (
    <div className={`flex items-start gap-3 my-4 animate-fade-in-up ${containerClasses}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-orange flex items-center justify-center shadow-sm">
            <LogoIcon className="w-6 h-6 text-white" />
        </div>
      )}

      <div className={`flex flex-col max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`rounded-3xl p-5 shadow-sm ${bubbleClasses}`}>
          {fileParts.length > 0 && (
              <div>
                  {fileParts.map((part, index) => (
                      <FileAttachment key={index} file={{ name: part.file.name, type: part.file.mimeType }} />
                  ))}
              </div>
          )}
          {combinedText || isStreaming ? (
            <div className={`${fileParts.length > 0 ? 'mt-2' : ''}`}>
              {isUser ? (
                 <p className="whitespace-pre-wrap">{combinedText}</p>
              ) : (
                <EnhancedMarkdown text={combinedText} isStreaming={isStreaming} />
              )}
            </div>
          ) : null}
        </div>
        {formattedTime && (
            <p className="text-xs text-foreground/50 mt-2 px-2">
                {formattedTime}
            </p>
        )}
      </div>

       {isUser && user && (
        <UserAvatar firstName={user.firstName} lastName={user.lastName} />
      )}
    </div>
  );
};

export default ChatMessage;