
import React from 'react';
import { LogoIcon } from './icons/LogoIcon.tsx';
import { SunIcon } from './icons/SunIcon.tsx';
import { MoonIcon } from './icons/MoonIcon.tsx';
import { MenuIcon } from './icons/MenuIcon.tsx';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme, onMenuClick }) => {
  return (
    <header className="flex items-center justify-between p-4 sticky top-0 bg-background/80 backdrop-blur-lg z-10 border-b border-brand-orange">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="md:hidden p-2 rounded-full hover:bg-surface">
          <MenuIcon />
        </button>
        <LogoIcon className="text-brand-orange" />
        <h1 className="text-lg font-bold">
          <span style={{ background: 'var(--brand-title-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
            Indie Coach
          </span>
        </h1>
      </div>
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full hover:bg-surface transition-colors"
        aria-label="Toggle theme"
      >
        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
      </button>
    </header>
  );
};

export default Header;