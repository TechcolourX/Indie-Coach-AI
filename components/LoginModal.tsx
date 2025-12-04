import React, { useState } from 'react';
import { LogoIcon } from './icons/LogoIcon.tsx';
import { CloseIcon } from './icons/CloseIcon.tsx';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string) => boolean;
  onSwitchToSignUp: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin, onSwitchToSignUp }) => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const success = onLogin(email);
    if (!success) {
        setErrors({ form: 'No account found with that email. Please sign up.' });
    } else {
        setErrors({});
        handleClose();
    }
  };

  const handleClose = () => {
    setEmail('');
    setErrors({});
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in" 
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="loginModalTitle"
    >
      <div className="relative bg-surface rounded-2xl shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <button 
            onClick={handleClose} 
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-background"
            aria-label="Close login form"
        >
            <CloseIcon className="w-5 h-5" />
        </button>
        <div className="p-8">
          <div className="text-center mb-6">
             <div className="flex justify-center mb-4">
                <LogoIcon className="w-12 h-12 text-brand-orange" />
             </div>
             <h2 id="loginModalTitle" className="text-2xl font-bold text-foreground">Welcome Back</h2>
             <p className="text-foreground/70 mt-1 text-sm">Log in to access your saved history.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-foreground/80 mb-1">Email Address</label>
              <input type="email" id="login-email" value={email} onChange={(e) => setEmail(e.target.value)} className={`w-full p-3 bg-background border rounded-lg focus:ring-0 text-foreground ${errors.email || errors.form ? 'border-red-500 dark:border-red-400 input-error' : 'border-surface-border'}`} aria-describedby="email-error form-error" required />
              {errors.email && <p id="email-error" className="text-red-600 dark:text-red-400 text-xs mt-1.5">{errors.email}</p>}
            </div>
            
            {errors.form && <p id="form-error" className="text-red-600 dark:text-red-400 text-sm text-center">{errors.form}</p>}

            <button type="submit" className="w-full brand-cta text-white font-bold py-3 px-6 rounded-lg shadow-md transform hover:scale-105 mt-2">
              Log In
            </button>
          </form>
          
          <p className="text-center text-sm text-foreground/70 mt-6">
            Don't have an account?{' '}
            <button onClick={onSwitchToSignUp} className="font-semibold text-brand-purple hover:underline rounded-md dark:text-violet-400">
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;