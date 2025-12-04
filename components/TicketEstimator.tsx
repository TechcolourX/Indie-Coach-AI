import React, { useState, useMemo, ChangeEvent } from 'react';

interface TicketEstimatorData {
  defaults: {
    ticketPrice: number;
    venueCapacity: number;
    sellThroughRate: number;
    merchSpendPerGuest: number;
    venueFeePercent: number;
    venueCostFixed: number;
    marketingCost: number;
    crewCost: number;
  };
}

interface TicketEstimatorProps {
  data: TicketEstimatorData;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const TicketEstimator: React.FC<TicketEstimatorProps> = ({ data }) => {
  const { defaults } = data;
  const [ticketPrice, setTicketPrice] = useState(defaults.ticketPrice);
  const [venueCapacity, setVenueCapacity] = useState(defaults.venueCapacity);
  const [sellThroughRate, setSellThroughRate] = useState(defaults.sellThroughRate);
  const [merchSpendPerGuest, setMerchSpendPerGuest] = useState(defaults.merchSpendPerGuest);
  const [venueFeePercent, setVenueFeePercent] = useState(defaults.venueFeePercent);
  const [venueCostFixed, setVenueCostFixed] = useState(defaults.venueCostFixed);
  const [marketingCost, setMarketingCost] = useState(defaults.marketingCost);
  const [crewCost, setCrewCost] = useState(defaults.crewCost);

  const calculations = useMemo(() => {
    const ticketsSold = Math.floor(venueCapacity * (sellThroughRate / 100));
    const grossTicketRevenue = ticketsSold * ticketPrice;
    const grossMerchRevenue = ticketsSold * merchSpendPerGuest;
    const totalGrossRevenue = grossTicketRevenue + grossMerchRevenue;

    const venueCutCost = grossTicketRevenue * (venueFeePercent / 100);
    const totalCosts = venueCutCost + venueCostFixed + marketingCost + crewCost;
    
    const netProfit = totalGrossRevenue - totalCosts;

    return { ticketsSold, grossTicketRevenue, grossMerchRevenue, totalGrossRevenue, venueCutCost, totalCosts, netProfit };
  }, [ticketPrice, venueCapacity, sellThroughRate, merchSpendPerGuest, venueFeePercent, venueCostFixed, marketingCost, crewCost]);

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<number>>) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
    setter(isNaN(value) ? 0 : value);
  };
  
  const InputRow: React.FC<{
    label: React.ReactNode;
    ariaLabel: string;
    value: number;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    min: number;
    max: number;
    step: number;
    unit?: string;
  }> = ({ label, ariaLabel, value, onChange, min, max, step, unit }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="font-medium text-sm text-foreground">{label}</label>
        <div className="relative justify-self-start">
          {unit === '$' && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50">$</span>}
          <input
            type="number"
            value={value || ''}
            onChange={onChange}
            className={`w-28 rounded-md border-surface-border bg-background py-2 pr-3 text-foreground shadow-sm focus:border-[var(--brand-purple)] focus:ring-0 ${unit === '$' ? 'pl-6' : 'pl-3'}`}
            min={min}
            max={max}
            step={step}
            aria-label={ariaLabel}
          />
          {unit === '%' && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50">%</span>}
        </div>
      </div>
      <input
        type="range"
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-[var(--brand-purple)]"
        aria-label={`${ariaLabel} range`}
      />
    </div>
  );
  
  const SimpleInputRow: React.FC<{
    label: string;
    id: string;
    value: number;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  }> = ({ label, id, value, onChange }) => (
     <div className="flex justify-between items-center">
        <label htmlFor={id} className="font-medium text-sm text-foreground">{label}</label>
        <div className="relative justify-self-start">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50">$</span>
            <input
                id={id}
                type="number"
                value={value || ''}
                onChange={onChange}
                className="w-28 rounded-md border-surface-border bg-background py-2 pl-6 pr-3 text-foreground shadow-sm focus:border-[var(--brand-purple)] focus:ring-0"
                placeholder="0"
                aria-label={label}
            />
        </div>
    </div>
  );

  return (
    <div className="my-6 p-4 md:p-6 rounded-lg border border-surface-border bg-surface">
      <h3 className="text-lg font-bold text-foreground mb-1">Ticket Sale Estimator</h3>
      <p className="text-sm text-foreground/70 mb-6">Adjust the inputs to project your potential earnings from a show.</p>
      
      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        
        {/* Inputs Column */}
        <div className="space-y-8">
            <div>
                <h4 className="font-bold text-base text-foreground mb-4">Show Details</h4>
                <div className="space-y-4">
                    <InputRow label="Ticket Price" ariaLabel="Ticket price" value={ticketPrice} onChange={handleInputChange(setTicketPrice)} min={0} max={200} step={1} unit="$" />
                    <InputRow label="Venue Capacity" ariaLabel="Venue capacity" value={venueCapacity} onChange={handleInputChange(setVenueCapacity)} min={0} max={5000} step={10} />
                    <InputRow
                        label={
                        <div className="flex items-baseline gap-1.5">
                            <span>Sell-Through Rate</span>
                            <span className="font-normal text-xs text-foreground/70">
                            (Est. {calculations.ticketsSold} Guests)
                            </span>
                        </div>
                        }
                        ariaLabel="Sell-through rate"
                        value={sellThroughRate}
                        onChange={handleInputChange(setSellThroughRate)}
                        min={0}
                        max={100}
                        step={1}
                        unit="%"
                    />
                </div>
            </div>
            <div>
                 <h4 className="font-bold text-base text-foreground mb-4">Revenue Streams</h4>
                 <div className="space-y-4">
                    <InputRow label="Merch Spend per Guest" ariaLabel="Merch spend per guest" value={merchSpendPerGuest} onChange={handleInputChange(setMerchSpendPerGuest)} min={0} max={100} step={1} unit="$" />
                 </div>
            </div>
             <div>
                 <h4 className="font-bold text-base text-foreground mb-4">Expenses</h4>
                 <div className="space-y-4">
                    <InputRow label="Venue's Cut of Tickets" ariaLabel="Venue's cut of tickets percentage" value={venueFeePercent} onChange={handleInputChange(setVenueFeePercent)} min={0} max={100} step={1} unit="%" />
                    <SimpleInputRow id="venueCostFixed" label="Venue Cost (Fixed Fee)" value={venueCostFixed} onChange={handleInputChange(setVenueCostFixed)} />
                    <SimpleInputRow id="marketingCost" label="Marketing & Promotion" value={marketingCost} onChange={handleInputChange(setMarketingCost)} />
                    <SimpleInputRow id="crewCost" label="Crew & Staff" value={crewCost} onChange={handleInputChange(setCrewCost)} />
                 </div>
            </div>
        </div>

        {/* Outputs Column */}
        <div className="space-y-4">
            <div className={`p-4 rounded-lg text-center ${calculations.netProfit >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                <h4 className="text-sm font-bold uppercase tracking-wider ${calculations.netProfit >= 0 ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}">Projected Net Profit</h4>
                <p className={`text-4xl font-extrabold my-2 ${calculations.netProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {formatCurrency(calculations.netProfit)}
                </p>
                <p className="text-xs text-foreground/60">
                    <span className="text-green-600 dark:text-green-500">{formatCurrency(calculations.totalGrossRevenue)}</span> Revenue - <span className="text-red-600 dark:text-red-500">{formatCurrency(calculations.totalCosts)}</span> Costs
                </p>
            </div>
            
            <div className="bg-background p-4 rounded-lg space-y-3">
                <h4 className="font-bold text-center text-foreground mb-2">Revenue Sources</h4>
                 <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-foreground/80">Ticket Sales (Gross)</span>
                    <span className="font-semibold text-foreground text-left">{formatCurrency(calculations.grossTicketRevenue)}</span>
                </div>
                 <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-foreground/80">Merch Sales (Gross)</span>
                    <span className="font-semibold text-foreground text-left">{formatCurrency(calculations.grossMerchRevenue)}</span>
                </div>
                <div className="border-t border-surface-border my-1"></div>
                <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-foreground">Total Gross Revenue</span>
                    <span className="font-bold text-foreground text-left">{formatCurrency(calculations.totalGrossRevenue)}</span>
                </div>
            </div>

            <div className="bg-background p-4 rounded-lg space-y-3">
                <h4 className="font-bold text-center text-foreground mb-2">Cost Breakdown</h4>
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-foreground/80">Venue's Cut ({venueFeePercent}%)</span>
                    <span className="font-semibold text-foreground text-left">{formatCurrency(calculations.venueCutCost)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-foreground/80">Venue Cost (Fixed)</span>
                    <span className="font-semibold text-foreground text-left">{formatCurrency(venueCostFixed)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-foreground/80">Marketing & Promotion</span>
                    <span className="font-semibold text-foreground text-left">{formatCurrency(marketingCost)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-foreground/80">Crew & Staff</span>
                    <span className="font-semibold text-foreground text-left">{formatCurrency(crewCost)}</span>
                </div>
                <div className="border-t border-surface-border my-1"></div>
                 <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-foreground">Total Costs</span>
                    <span className="font-bold text-foreground text-left">{formatCurrency(calculations.totalCosts)}</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TicketEstimator;