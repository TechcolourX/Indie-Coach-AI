import { MicIcon } from './components/icons/MicIcon.tsx';
import { BrandingIcon } from './components/icons/BrandingIcon.tsx';
import { BusinessIcon } from './components/icons/BusinessIcon.tsx';
import { ManagementIcon } from './components/icons/ManagementIcon.tsx';
import { MarketingIcon } from './components/icons/MarketingIcon.tsx';
import { LegalIcon } from './components/icons/LegalIcon.tsx';
import { TicketIcon } from './components/icons/TicketIcon.tsx';
import { CalculatorIcon } from './components/icons/CalculatorIcon.tsx';
import { SYSTEM_INSTRUCTION, ALL_ABOUT_MUSIC_BUSINESS_SUMMARY } from './core/prompts.ts';

// Re-export the imported constants so other frontend components can still access them from here.
export { SYSTEM_INSTRUCTION, ALL_ABOUT_MUSIC_BUSINESS_SUMMARY };

export const TOPIC_SUGGESTIONS = [
  {
    icon: MicIcon,
    title: "Artist Development",
    prompts: [
      "I'm a new artist. Can you create a 90-day development plan for me to find my sound?",
      "What are three daily exercises I can do to improve my vocal control and delivery?",
      "How do I build creative confidence and overcome writer's block?",
    ]
  },
  {
    icon: BrandingIcon,
    title: "Branding & Identity",
    prompts: [
        "Help me define my artist brand. What are the first 3 steps I should take?",
        "What's a content pillar? Give me 4 examples for a hip-hop artist on TikTok.",
        "How do I figure out who my target audience is? Give me a persona template.",
    ]
  },
  {
    icon: BusinessIcon,
    title: "Business Strategy",
    prompts: [
        "What are 5 different ways I can monetize my music besides streaming royalties?",
        "Explain how to build a fan acquisition funnel for an independent artist.",
        "How do I properly use analytics to grow my music career?",
    ]
  },
   {
    icon: ManagementIcon,
    title: "Artist Management",
    prompts: [
        "I think I'm ready for a manager. What are some red flags I should look out for?",
        "What does a day-to-day manager actually do for an artist?",
        "How do I professionally pitch myself to a potential manager in an email?",
    ]
  },
  {
    icon: MarketingIcon,
    title: "Marketing & Release",
    prompts: [
        "I have a new single coming out in 2 months. Give me a step-by-step release plan.",
        "How do I create an effective Electronic Press Kit (EPK)? What should it include?",
        "Give me a 7-day content plan for the week my new song drops.",
    ]
  },
  {
    icon: LegalIcon,
    title: "Music Law Basics",
    prompts: [
        "Explain the difference between a master and publishing rights like I'm a beginner.",
        "What is a PRO, and why do I need one as a songwriter?",
        "Break down a producer split sheet. What are the essential parts?",
    ]
  }
];

export const TOOL_SUGGESTIONS = [
    {
        icon: TicketIcon,
        title: "Ticket Sale Estimator",
        prompts: [
            "Create a ticket sale estimator tool for my next concert.",
        ]
    },
    {
        icon: CalculatorIcon,
        title: "Release Budget Calculator",
        prompts: [
            "Create a sample budget for a self-funded single release.",
        ]
    }
];