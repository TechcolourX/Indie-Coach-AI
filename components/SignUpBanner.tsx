
import React from 'react';

interface SignUpBannerProps {
  onSignUp: () => void;
}

const SignUpBanner: React.FC<SignUpBannerProps> = ({ onSignUp }) => {
  return (
    <div className="text-center p-3 bg-brand-orange/10 dark:bg-brand-orange/20 rounded-xl mb-3 border border-brand-orange/20 dark:border-brand-orange/30 animate-fade-in-up">
      <p className="text-sm text-foreground font-medium mb-2">You've reached your free message limit.</p>
      <button
        onClick={onSignUp}
        className="brand-cta text-white font-bold py-2 px-4 rounded-lg text-sm"
      >
        Sign Up to Continue
      </button>
    </div>
  );
};

export default SignUpBanner;