// Fix: Add types for the Web Speech API to resolve TypeScript error 'Cannot find name SpeechRecognition'.
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  start(): void;
  stop(): void;
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

import React, { useState, useRef, useEffect } from 'react';
import { SendIcon } from './icons/SendIcon.tsx';
import { LoadingIcon } from './icons/LoadingIcon.tsx';
import { AttachmentIcon } from './icons/AttachmentIcon.tsx';
import { CloseIcon } from './icons/CloseIcon.tsx';
import { MicIcon } from './icons/MicIcon.tsx';

interface ChatInputProps {
  onSendMessage: (text: string, file?: File | null) => void;
  isLoading: boolean;
  isLocked: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, isLocked }) => {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeechApiSupported, setIsSpeechApiSupported] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSpeechApiSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setText(transcript);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsRecording(false);
      };
      
      recognitionRef.current = recognition;
    }
  }, []);

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };
  
  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      setText('');
      recognitionRef.current.start();
    }
    setIsRecording(!isRecording);
  };

  const submitMessage = () => {
    if (text.trim() || file) {
      onSendMessage(text, file);
      setText('');
      removeFile();
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMessage();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitMessage();
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${scrollHeight}px`;
    }
  }, [text]);

  let placeholderText = "Ask your coach anything...";
  if (isLocked) placeholderText = "Please sign up to continue";
  if (isRecording) placeholderText = "Listening...";


  return (
    <div className="bg-surface rounded-2xl shadow-lg border border-surface-border">
        {file && (
            <div className="p-2 m-2 bg-background border border-surface-border rounded-lg flex items-center justify-between animate-fade-in">
                <span className="text-sm font-medium text-foreground/80 truncate ml-2">{file.name}</span>
                <button onClick={removeFile} className="p-1 rounded-full hover:bg-surface-border">
                    <CloseIcon className="w-4 h-4" />
                </button>
            </div>
        )}
        <form onSubmit={handleFormSubmit} className="flex items-end gap-2 p-2">
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
        <button
            type="button"
            onClick={handleAttachmentClick}
            disabled={isLoading || isLocked || isRecording}
            className="w-11 h-11 flex-shrink-0 flex items-center justify-center text-foreground/60 rounded-xl hover:bg-background disabled:opacity-50 transition-colors"
            aria-label="Attach file"
        >
            <AttachmentIcon className="w-6 h-6" />
        </button>
        <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholderText}
            className="flex-1 bg-transparent border-none focus:ring-0 resize-none p-2.5 placeholder-color max-h-48 text-foreground"
            rows={1}
            disabled={isLoading || isLocked || isRecording}
            aria-label="Chat input"
        />
        <button
          type="button"
          onClick={toggleRecording}
          disabled={isLoading || isLocked || !isSpeechApiSupported}
          className={`w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-full transition-colors ${
              isRecording 
                  ? 'text-white bg-red-500 recording-indicator' 
                  : 'text-foreground/60 hover:bg-background'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-label={!isSpeechApiSupported ? 'Voice input not supported' : (isRecording ? 'Stop recording' : 'Start recording')}
          title={!isSpeechApiSupported ? 'Voice input is not supported in your browser' : (isRecording ? 'Stop recording' : 'Start recording')}
        >
          <MicIcon className="w-6 h-6" />
        </button>
        <button
            type="submit"
            disabled={isLoading || (!text.trim() && !file) || isLocked}
            className="brand-cta w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-full shadow-lg transform hover:scale-105 active:scale-95"
            aria-label="Send message"
        >
            {isLoading ? <LoadingIcon /> : <SendIcon />}
        </button>
        </form>
    </div>
  );
};

export default ChatInput;