import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon.tsx';

interface FollowUpPromptsProps {
  prompts: string[];
  onPromptClick: (prompt: string) => void;
  isLoading: boolean;
}

const FollowUpPrompts: React.FC<FollowUpPromptsProps> = ({ prompts, onPromptClick, isLoading }) => {
  return (
    <div className="my-8 animate-fade-in-up">
        <h3 className="flex items-center justify-center gap-2 text-sm font-semibold text-foreground/60 mb-3">
            <SparklesIcon />
            <span>Keep the conversation going</span>
        </h3>
        <div className="flex flex-wrap justify-center gap-3">
        {prompts.map((prompt, index) => (
            <button
            key={index}
            onClick={() => onPromptClick(prompt)}
            disabled={isLoading}
            className="px-4 py-2 bg-surface rounded-full text-sm font-medium text-foreground hover:bg-gray-200 dark:hover:bg-gray-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
            {prompt}
            </button>
        ))}
        </div>
    </div>
  );
};

export default FollowUpPrompts;