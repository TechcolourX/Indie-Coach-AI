import React from 'react';
import { LogoIcon } from './icons/LogoIcon.tsx';
import { SparklesIcon } from './icons/SparklesIcon.tsx';
import { CalculatorIcon } from './icons/CalculatorIcon.tsx';
import { BookOpenIcon } from './icons/BookOpenIcon.tsx';

interface AuthProps {
  onSignUpClick: () => void;
  onLoginClick: () => void;
  onGuestClick: () => void;
}

const Auth: React.FC<AuthProps> = ({ onSignUpClick, onLoginClick, onGuestClick }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-6 animate-fade-in">
      <div className="text-center w-full max-w-4xl">
        <div className="flex justify-center mb-6">
          <LogoIcon className="w-16 h-16 text-brand-orange" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Welcome to <span style={{ background: 'var(--brand-title-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>Indie Coach</span>
        </h1>
        <p className="text-base text-foreground/70 mb-12 max-w-2xl mx-auto">
          Your AI-powered coach for independent artists. Get expert guidance on creativity, branding, business, and marketing to grow your music career.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 text-left mb-16">
            <div className="flex flex-col items-center md:items-start text-center md:text-left p-4 rounded-xl hover:bg-surface transition-colors">
                <div className="bg-brand-orange/10 dark:bg-orange-400/20 p-3 rounded-full mb-4 inline-block">
                    <SparklesIcon className="w-6 h-6 text-brand-orange dark:text-orange-400" />
                </div>
                <h3 className="font-semibold mb-2 text-foreground text-base">Get Instant Answers</h3>
                <p className="text-foreground/60 text-sm">Ask anything from marketing plans to lyric feedback and get expert, actionable advice in seconds.</p>
            </div>
            <div className="flex flex-col items-center md:items-start text-center md:text-left p-4 rounded-xl hover:bg-surface transition-colors">
                <div className="bg-brand-orange/10 dark:bg-orange-400/20 p-3 rounded-full mb-4 inline-block">
                    <CalculatorIcon className="w-6 h-6 text-brand-orange dark:text-orange-400" />
                </div>
                <h3 className="font-semibold mb-2 text-foreground text-base">Plan Your Success</h3>
                <p className="text-foreground/60 text-sm">Use interactive tools to estimate ticket sales for your shows and budget for your next single release.</p>
            </div>
            <div className="flex flex-col items-center md:items-start text-center md:text-left p-4 rounded-xl hover:bg-surface transition-colors">
                <div className="bg-brand-orange/10 dark:bg-orange-400/20 p-3 rounded-full mb-4 inline-block">
                    <BookOpenIcon className="w-6 h-6 text-brand-orange dark:text-orange-400" />
                </div>
                <h3 className="font-semibold mb-2 text-foreground text-base">Learn From The Best</h3>
                <p className="text-foreground/60 text-sm">Unlock key insights from industry-leading books like 'All About the Music Business' to make smarter career moves.</p>
            </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onSignUpClick}
            className="w-full sm:w-auto brand-cta font-bold py-3 px-8 rounded-xl"
          >
            Create Free Account
          </button>
          <button
            onClick={onLoginClick}
            className="w-full sm:w-auto brand-cta font-bold py-3 px-8 rounded-xl"
          >
            Log In
          </button>
        </div>
        <div className="mt-6">
          <button
            onClick={onGuestClick}
            className="text-foreground/60 font-medium py-2 px-6 rounded-lg hover:text-foreground transition-colors"
          >
            Continue as Guest &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;