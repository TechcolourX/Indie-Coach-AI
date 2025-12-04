// This file now defines the shape of Vite's environment variables for TypeScript.
// This ensures that `import.meta.env.VITE_API_KEY` is correctly typed throughout the app.
// Fix: Wrap ImportMeta and ImportMetaEnv in `declare global` to augment the global scope, making Vite environment variables available project-wide in TypeScript.
declare global {
  interface ImportMetaEnv {
    readonly VITE_API_KEY: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

import { Part } from '@google/genai';

export enum Role {
  User = 'user',
  AI = 'model',
}

export interface TextPart {
  type: 'text';
  text: string;
}

export interface FilePart {
  type: 'file';
  file: {
    name: string;
    mimeType: string;
    data: string; // base64 encoded
  };
}

export type AppPart = TextPart | FilePart;


export interface Message {
  role: Role;
  parts: AppPart[];
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
}
