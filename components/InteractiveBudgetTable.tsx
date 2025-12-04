import React, { useState, useMemo } from 'react';
import { InfoIcon } from './icons/InfoIcon.tsx';

interface BudgetRow {
  item: string;
  low: number;
  high: number;
  estimate: number;
}

interface InteractiveBudgetTableProps {
  data: {
    headers: string[];
    rows: BudgetRow[];
  };
}

const InteractiveBudgetTable: React.FC<InteractiveBudgetTableProps> = ({ data }) => {
  const initialEstimates = data.rows.map(row => row.estimate);
  const [estimates, setEstimates] = useState<number[]>(initialEstimates);

  const handleEstimateChange = (index: number, value: string) => {
    const newEstimates = [...estimates];
    const parsedValue = parseInt(value, 10);
    newEstimates[index] = isNaN(parsedValue) ? 0 : parsedValue;
    setEstimates(newEstimates);
  };

  const total = useMemo(() => {
    return estimates.reduce((acc, current) => acc + (current || 0), 0);
  }, [estimates]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="my-6 rounded-lg border-surface-border overflow-hidden">
      <div className="overflow-x-auto bg-surface">
        <table className="min-w-full text-sm">
          <thead className="hidden md:table-header-group bg-background text-left">
            <tr>
              {data.headers.map((header, i) => (
                <th key={i} scope="col" className="px-4 py-3 font-semibold text-foreground/70 tracking-wide">
                  <div className="flex items-center gap-1.5">
                    <span>{header}</span>
                    {header.includes('Estimate') && (
                      <div className="group relative">
                        <InfoIcon className="w-4 h-4 text-foreground/50" />
                        <span className="absolute z-10 bottom-full mb-2 w-48 rounded-md bg-black px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          You can edit these values to calculate your own budget.
                        </span>
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="block md:table-row-group divide-y divide-surface-border">
            {data.rows.map((row, i) => (
              <tr key={i} className="block p-4 md:p-0 md:table-row">
                {/* Item */}
                <td data-label={data.headers[0]} className="grid grid-cols-2 items-center py-1 md:py-3 md:px-4 md:table-cell">
                  <span className="font-semibold text-sm text-foreground/80 md:hidden">{data.headers[0]}</span>
                  <span className="font-medium text-foreground text-left">{row.item}</span>
                </td>
                {/* Low End */}
                 <td data-label={data.headers[1]} className="grid grid-cols-2 items-center py-1 md:py-3 md:px-4 md:table-cell">
                  <span className="font-semibold text-sm text-foreground/80 md:hidden">{data.headers[1]}</span>
                  <span className="text-foreground/80 text-left">{formatCurrency(row.low)}</span>
                </td>
                {/* High End */}
                 <td data-label={data.headers[2]} className="grid grid-cols-2 items-center py-1 md:py-3 md:px-4 md:table-cell">
                  <span className="font-semibold text-sm text-foreground/80 md:hidden">{data.headers[2]}</span>
                  <span className="text-foreground/80 text-left">{formatCurrency(row.high)}</span>
                </td>
                {/* My Example Estimate */}
                <td data-label={data.headers[3]} className="grid grid-cols-2 items-center py-2 md:py-3 md:px-4 md:table-cell">
                   <span className="font-semibold text-sm text-foreground/80 md:hidden">{data.headers[3]}</span>
                  <div className="relative justify-self-start">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50">$</span>
                    <input
                      type="number"
                      value={estimates[i] === 0 ? '' : estimates[i]}
                      id={`estimate-${i}`}
                      onChange={(e) => handleEstimateChange(i, e.target.value)}
                      onFocus={(e) => e.target.select()}
                      className="w-32 rounded-md border-surface-border bg-background py-2 pl-6 pr-2 text-foreground shadow-sm focus:border-[var(--brand-purple)] focus:ring-0"
                      placeholder="0"
                      aria-label={`Estimate for ${row.item}`}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
           <tfoot className="bg-background/80 backdrop-blur-sm sticky bottom-0 md:static">
              <tr className="block p-4 md:p-0 md:table-row">
                {/* Mobile Total */}
                <td className="grid grid-cols-2 items-center md:hidden">
                    <span className="font-bold text-foreground">Total Estimate</span>
                    <span className="font-bold text-brand-orange dark:text-orange-400 text-lg text-left">{formatCurrency(total)}</span>
                </td>
                {/* Desktop Total */}
                <td colSpan={data.headers.length - 1} className="hidden md:table-cell px-4 py-3 text-right font-bold text-foreground">Total Estimate</td>
                <td className="hidden md:table-cell px-4 py-3 font-bold text-brand-orange dark:text-orange-400 text-lg text-left">{formatCurrency(total)}</td>
              </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default InteractiveBudgetTable;