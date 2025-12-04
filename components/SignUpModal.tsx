import React, { useState } from 'react';
import { LogoIcon } from './icons/LogoIcon.tsx';
import { type User } from '../types.ts';
import { CloseIcon } from './icons/CloseIcon.tsx';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUp: (userData: User) => string | null;
  onSwitchToLogin: () => void;
}

const SignUpModal: React.FC<SignUpModalProps> = ({ isOpen, onClose, onSignUp, onSwitchToLogin }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!isOpen) return null;
  
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required.';
    } else if (!/^[a-zA-Z-' ]+$/.test(firstName)) {
      newErrors.firstName = 'Please enter a valid name.';
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required.';
    } else if (!/^[a-zA-Z-' ]+$/.test(lastName)) {
      newErrors.lastName = 'Please enter a valid name.';
    }

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
    
    setErrors({});
    const signUpError = onSignUp({ firstName, lastName, email });
    if (signUpError) {
      setErrors({ form: signUpError });
    }
  };
  
  const handleClose = () => {
    setFirstName('');
    setLastName('');
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
      aria-labelledby="signUpModalTitle"
    >
      <div className="relative bg-surface rounded-2xl shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <button 
            onClick={handleClose} 
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-background"
            aria-label="Close sign up form"
        >
            <CloseIcon className="w-5 h-5" />
        </button>
        <div className="p-8">
          <div className="text-center mb-6">
             <div className="flex justify-center mb-4">
                <LogoIcon className="w-12 h-12 text-brand-orange" />
             </div>
             <h2 id="signUpModalTitle" className="text-2xl font-bold text-foreground">Create Your Account</h2>
             <p className="text-foreground/70 mt-1 text-sm">Unlock your full potential and save your progress.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="firstName" className="block text-sm font-medium text-foreground/80 mb-1">First Name</label>
                <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={`w-full p-3 bg-background border rounded-lg focus:ring-0 text-foreground ${errors.firstName ? 'border-red-500 dark:border-red-400 input-error' : 'border-surface-border'}`} aria-describedby="firstName-error" required />
                {errors.firstName && <p id="firstName-error" className="text-red-600 dark:text-red-400 text-xs mt-1.5">{errors.firstName}</p>}
              </div>
              <div className="flex-1">
                <label htmlFor="lastName" className="block text-sm font-medium text-foreground/80 mb-1">Last Name</label>
                <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className={`w-full p-3 bg-background border rounded-lg focus:ring-0 text-foreground ${errors.lastName ? 'border-red-500 dark:border-red-400 input-error' : 'border-surface-border'}`} aria-describedby="lastName-error" required />
                 {errors.lastName && <p id="lastName-error" className="text-red-600 dark:text-red-400 text-xs mt-1.5">{errors.lastName}</p>}
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground/80 mb-1">Email Address</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`w-full p-3 bg-background border rounded-lg focus:ring-0 text-foreground ${errors.email ? 'border-red-500 dark:border-red-400 input-error' : 'border-surface-border'}`} aria-describedby="email-error" required />
              {errors.email && <p id="email-error" className="text-red-600 dark:text-red-400 text-xs mt-1.5">{errors.email}</p>}
            </div>
            
            {errors.form && <p className="text-red-600 dark:text-red-400 text-sm text-center">{errors.form}</p>}

            <button type="submit" className="w-full brand-cta text-white font-bold py-3 px-6 rounded-lg shadow-md transform hover:scale-105 mt-2">
              Create Account
            </button>
          </form>
          
          <p className="text-center text-sm text-foreground/70 mt-6">
            Already have an account?{' '}
            <button onClick={onSwitchToLogin} className="font-semibold text-brand-purple hover:underline rounded-md dark:text-violet-400">
              Log In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpModal;