import React from 'react';
import InteractiveBudgetTable from './InteractiveBudgetTable.tsx';
import TicketEstimator from './TicketEstimator.tsx';
import { InfoIcon } from './icons/InfoIcon.tsx';
import { CheckIcon } from './icons/CheckIcon.tsx';

// Inline parser for bold, italic, code
const parseInline = (text: string): React.ReactNode => {
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
    
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
          return <em key={i}>{part.slice(1, -1)}</em>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return <code key={i} className="bg-background border border-surface-border rounded px-1.5 py-1 text-sm font-mono">{part.slice(1, -1)}</code>;
        }
        return part;
      });
};

const emojiRegex = /^(\p{Emoji_Presentation}|\p{Extended_Pictographic})/u;

const MarkdownContent: React.FC<{ text: string }> = ({ text }) => {
  const standardizedText = text.replace(/\n{3,}/g, '\n\n');
  const blocks = standardizedText.split('\n\n');

  const elements = blocks.map((block, index) => {
    if (block.trim() === '') return null;

    if (block.startsWith('# ')) {
        const content = block.substring(2);
        const match = content.match(emojiRegex);
        const emoji = match ? match[0] : '🎵';
        const textContent = match ? content.substring(emoji.length).trim() : content;
        return (
            <h1 key={index} className="flex items-start text-2xl font-extrabold mt-6 mb-4 border-b-2 pb-3 border-surface-border">
                <span className="mr-3 text-2xl leading-tight">{emoji}</span>
                <span className="flex-1 leading-tight">{parseInline(textContent)}</span>
            </h1>
        );
    }
    if (block.startsWith('## ')) {
        const content = block.substring(3);
        const match = content.match(emojiRegex);
        const emoji = match ? match[0] : '💡';
        const textContent = match ? content.substring(emoji.length).trim() : content;
        return (
            <h2 key={index} className="flex items-start text-xl font-extrabold mt-6 mb-3">
                <span className="mr-3 text-xl leading-tight">{emoji}</span>
                <span className="flex-1 leading-tight">{parseInline(textContent)}</span>
            </h2>
        );
    }
    if (block.startsWith('### ')) {
        const content = block.substring(4);
        const match = content.match(emojiRegex);
        const emoji = match ? match[0] : '✅';
        const textContent = match ? content.substring(emoji.length).trim() : content;
        return (
            <h3 key={index} className="flex items-start text-lg font-semibold mt-5 mb-2 text-brand-purple dark:text-violet-400">
                <span className="mr-2.5 text-lg leading-tight">{emoji}</span>
                <span className="flex-1 leading-tight">{parseInline(textContent)}</span>
            </h3>
        );
    }
    
    if (block.startsWith('> [!TIP]')) {
      const content = block.split('\n').map(line => line.replace(/^> ?/, '')).join('\n').replace('[!TIP]', '').trim();
      return (
          <div key={index} className="my-4 p-4 rounded-lg bg-brand-orange/10 dark:bg-brand-orange/20 border-l-4 border-brand-orange dark:border-orange-400 flex items-start gap-3">
              <span className="text-xl mt-1" role="img" aria-label="tip">✨</span>
              <div className="flex-1">{parseInline(content)}</div>
          </div>
      );
    }

    if (block.startsWith('> [!IMPORTANT]')) {
      const content = block.split('\n').map(line => line.replace(/^> ?/, '')).join('\n').replace('[!IMPORTANT]', '').trim();
      return (
          <div key={index} className="my-4 p-4 rounded-lg bg-blue-500/10 dark:bg-blue-400/20 border-l-4 border-blue-500 dark:border-blue-400 flex items-start gap-3">
              <InfoIcon className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-0.5 shrink-0" />
              <div className="flex-1">{parseInline(content)}</div>
          </div>
      );
    }

    if (block.startsWith('> [!ACTION]')) {
      const content = block.split('\n').map(line => line.replace(/^> ?/, '')).join('\n').replace('[!ACTION]', '').trim();
      return (
          <div key={index} className="my-4 p-4 rounded-lg bg-brand-purple/10 dark:bg-brand-purple/20 border-l-4 border-brand-purple dark:border-violet-400 flex items-start gap-3">
              <CheckIcon className="w-5 h-5 text-brand-purple dark:text-violet-400 mt-0.5 shrink-0" />
              <div className="flex-1">{parseInline(content)}</div>
          </div>
      );
    }
    
    if (block.startsWith('> ')) {
        const quoteLines = block.split('\n').map(line => line.replace(/^> ?/, '')).join('\n');
        return <blockquote key={index} className="border-l-4 border-surface-border pl-4 pr-2 py-2 my-4 text-foreground/80 bg-surface rounded-r-lg">{parseInline(quoteLines)}</blockquote>
    }

    const lines = block.trim().split('\n');
    const isTable = lines.length >= 2 && lines[1].includes('---') && lines[1].includes('|');
    if (isTable) {
        const headerLine = lines[0];
        const rows = lines.slice(2);
        const headers = headerLine.trim().replace(/^\||\|$/g, '').split('|').map(h => h.trim());
        return (
            <div key={index} className="my-6 overflow-x-auto rounded-lg border border-surface-border">
                <table className="min-w-full divide-y divide-surface-border text-sm">
                    <thead className="bg-background">
                        <tr>{headers.map((header, i) => <th key={i} scope="col" className="px-4 py-3 text-left font-semibold text-foreground/70 tracking-wide">{parseInline(header)}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y divide-surface-border bg-surface">
                        {rows.map((row, i) => {
                            if (row.trim() === '') return null;
                            const cells = row.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim());
                            return (
                                <tr key={i} className="hover:bg-background/50">
                                    {cells.map((cell, j) => <td key={j} className="px-4 py-3 whitespace-normal align-top">{parseInline(cell)}</td>)}
                                    {Array.from({ length: headers.length - cells.length }).map((_, k) => <td key={cells.length + k} className="px-4 py-3"></td>)}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    }

    if (block.startsWith('* ') || block.startsWith('- ') || /^\d+\.\s/.test(block)) {
        const listLines = block.split('\n').filter(line => line.trim() !== '');
        const isOrdered = /^\d+\.\s/.test(listLines[0]);
        if (isOrdered) {
            const listItems = listLines.map((line, i) => {
                const listContent = line.replace(/^\d+\.\s/, '');
                const match = listContent.match(emojiRegex);
                const emoji = match ? match[0] : null;
                const textContent = emoji ? listContent.substring(emoji.length).trim() : listContent;
                return (
                    <li key={i} className="flex items-start mb-2">
                        <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full border-2 border-brand-purple text-brand-purple text-sm mr-4 mt-0.5">
                            {i + 1}
                        </span>
                        <span className="flex-1 leading-relaxed">
                            {emoji && <span className="mr-2">{emoji}</span>}
                            {parseInline(textContent)}
                        </span>
                    </li>
                );
            });
            return <ol key={index} className="my-4 list-none">{listItems}</ol>;
        } else {
             const listItems = listLines.map((line, i) => {
                const listContent = line.replace(/^(\* |-\s)/, '');
                const match = listContent.match(emojiRegex);
                const emoji = match ? match[0] : null;
                const textContent = emoji ? listContent.substring(emoji.length).trim() : listContent;
                return (
                    <li key={i} className="flex items-start mb-2">
                        {emoji ? (
                             <span className="mr-3 text-lg shrink-0 w-5 text-center">{emoji}</span>
                        ) : (
                            <span className="text-brand-orange dark:text-orange-400 mr-3 mt-1 shrink-0">✨</span>
                        )}
                        <span className="flex-1 leading-relaxed">{parseInline(textContent)}</span>
                    </li>
                );
             });
            return <ul key={index} className="my-4 list-none">{listItems}</ul>;
        }
    }

    return <p key={index} className="leading-relaxed my-5 whitespace-pre-wrap">{parseInline(block)}</p>;
  }).filter(Boolean);

  return <>{elements}</>;
};

const ComponentError: React.FC<{ componentKey: string | number }> = ({ componentKey }) => (
    <div key={componentKey} className="my-4 p-4 rounded-lg bg-red-500/10 border-l-4 border-red-500">
      <p className="font-semibold text-red-700 dark:text-red-300">Error Rendering Component</p>
      <p className="text-sm text-red-600 dark:text-red-400">Could not display the interactive tool due to a formatting issue.</p>
    </div>
);

const EnhancedMarkdown: React.FC<{ text: string; isStreaming?: boolean; }> = ({ text, isStreaming }) => {
  const componentBlockRegex = /(\[BUDGET_TABLE\][\s\S]*?\[\/BUDGET_TABLE\]|\[TICKET_ESTIMATOR\][\s\S]*?\[\/TICKET_ESTIMATOR\])/g;
  const parts = text.split(componentBlockRegex);

  return (
    <div className="whitespace-normal">
      {parts.map((part, index) => {
        if (!part) return null;

        const budgetMatch = part.match(/^\[BUDGET_TABLE\]([\s\S]*)\[\/BUDGET_TABLE\]$/);
        if (budgetMatch && budgetMatch[1]) {
          try {
            const jsonData = JSON.parse(budgetMatch[1]);
            if (jsonData.headers && jsonData.rows) {
              return <InteractiveBudgetTable key={index} data={jsonData} />;
            }
          } catch (e) {
            console.error("Failed to parse BUDGET_TABLE JSON:", e);
          }
          return <ComponentError componentKey={index} />;
        }

        const ticketMatch = part.match(/^\[TICKET_ESTIMATOR\]([\s\S]*)\[\/TICKET_ESTIMATOR\]$/);
        if (ticketMatch && ticketMatch[1]) {
          try {
            const jsonData = JSON.parse(ticketMatch[1]);
            if (jsonData.defaults) {
              return <TicketEstimator key={index} data={jsonData} />;
            }
          } catch (e) {
            console.error("Failed to parse TICKET_ESTIMATOR JSON:", e);
          }
          return <ComponentError componentKey={index} />;
        }
        
        // If no component block matched, treat as standard markdown.
        return <MarkdownContent key={index} text={part} />;
      })}
      {isStreaming && <span className="blinking-cursor" />}
    </div>
  );
};

export default EnhancedMarkdown;