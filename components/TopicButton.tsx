import React from 'react';

interface TopicButtonProps {
  icon: React.ElementType;
  title: string;
  onClick: () => void;
  disabled: boolean;
}

const TopicButton: React.FC<TopicButtonProps> = ({ icon: IconComponent, title, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center text-left gap-4 p-4 bg-surface rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-sm hover:shadow-lg"
    >
      <div className="flex-shrink-0 bg-brand-orange/10 dark:bg-orange-400/20 p-3 rounded-full">
        <IconComponent className="w-6 h-6 text-brand-orange dark:text-orange-400" />
      </div>
      <span className="font-semibold text-foreground">{title}</span>
    </button>
  );
};

export default TopicButton;