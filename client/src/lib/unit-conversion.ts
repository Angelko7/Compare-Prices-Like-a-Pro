// Shared logic for unit normalization and calculation

export type UnitType = 'weight' | 'volume' | 'count';

export interface UnitDef {
  value: string;
  label: string;
  type: UnitType;
  baseFactor: number; // Multiplier to get to base unit (g or ml)
}

export const UNITS: UnitDef[] = [
  // Weight (Base: gram)
  { value: 'g', label: 'g (Grams)', type: 'weight', baseFactor: 1 },
  { value: 'kg', label: 'kg (Kilograms)', type: 'weight', baseFactor: 1000 },
  { value: 'oz', label: 'oz (Ounces)', type: 'weight', baseFactor: 28.3495 },
  { value: 'lb', label: 'lb (Pounds)', type: 'weight', baseFactor: 453.592 },
  
  // Volume (Base: ml)
  { value: 'ml', label: 'ml (Milliliters)', type: 'volume', baseFactor: 1 },
  { value: 'l', label: 'L (Liters)', type: 'volume', baseFactor: 1000 },
  { value: 'fl_oz', label: 'fl oz (Fluid Oz)', type: 'volume', baseFactor: 29.5735 },
  { value: 'gal', label: 'gal (Gallons)', type: 'volume', baseFactor: 3785.41 },
  
  // Count (Base: each)
  { value: 'ea', label: 'ea (Each)', type: 'count', baseFactor: 1 },
];

export function getUnitType(unitValue: string): UnitType | undefined {
  return UNITS.find(u => u.value === unitValue)?.type;
}

export function normalizePrice(price: number, quantity: number, unitValue: string): number {
  const unit = UNITS.find(u => u.value === unitValue);
  if (!unit) return 0;
  
  // Calculate price per base unit (e.g., $ per gram)
  const totalBaseUnits = quantity * unit.baseFactor;
  if (totalBaseUnits === 0) return 0;
  
  return price / totalBaseUnits;
}

export function formatUnitPrice(price: number, quantity: number, unitValue: string): string {
  const unit = UNITS.find(u => u.value === unitValue);
  if (!unit) return '-';
  
  const unitPrice = price / quantity;
  
  return `$${unitPrice.toFixed(2)} / ${unit.value}`;
}

export function formatBestValue(price: number, quantity: number, unitValue: string): string {
  const unit = UNITS.find(u => u.value === unitValue);
  if (!unit) return '-';
  
  const normalized = normalizePrice(price, quantity, unitValue);
  
  // Convert back to a readable standard unit for display
  // For weight, show per 100g or per lb or per oz depending on what makes sense
  // Let's stick to base units for standardization:
  // Weight: per 100g
  // Volume: per 100ml
  // Count: per 1 ea
  
  if (unit.type === 'weight') {
    return `$${(normalized * 100).toFixed(2)} / 100g`;
  } else if (unit.type === 'volume') {
    return `$${(normalized * 100).toFixed(2)} / 100ml`;
  } else {
    return `$${normalized.toFixed(2)} / ea`;
  }
}
