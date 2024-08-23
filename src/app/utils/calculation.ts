import { ACRYLIC_PANELS, CUT_LOSS } from './acrylicPanel';

interface Dimensions {
  [key: string]: { width: number; height: number };
}

interface Sheet {
  width: number;
  height: number;
  name: string;
  price: number;
}

interface LayoutItem {
  x: number;
  y: number;
  width: number;
  height: number;
  part: string;
}

export const calculateDimensions = (
  width: number,
  height: number,
  depth: number,
  thickness: number
): Dimensions => {
  return {
    top: { width, height: depth },
    bottom: { width, height: depth },
    left: { width: depth - thickness * 2, height: height - thickness * 2 },
    right: { width: depth - thickness * 2, height: height - thickness * 2 },
    front: { width, height: height - thickness * 2 },
    back: { width, height: height - thickness * 2 },
  };
};

const fitPartsOnSheet = (
  dimensions: Dimensions,
  sheet: Sheet,
  quantity: number
): LayoutItem[] => {
  const layout: LayoutItem[] = [];
  let currentX = 0;
  let currentY = 0;
  let maxHeightInRow = 0;

  const parts = Object.entries(dimensions);
  const totalParts = parts.length * quantity;
  let placedParts = 0;

  while (placedParts < totalParts) {
    for (const [part, size] of parts) {
      if (currentX + size.width > sheet.width) {
        currentX = 0;
        currentY += maxHeightInRow;
        maxHeightInRow = 0;
      }

      if (currentY + size.height > sheet.height) {
        return layout; // Sheet is full
      }

      layout.push({
        x: currentX,
        y: currentY,
        width: size.width,
        height: size.height,
        part,
      });

      currentX += size.width;
      maxHeightInRow = Math.max(maxHeightInRow, size.height);
      placedParts++;

      if (placedParts >= totalParts) {
        break;
      }
    }
  }

  return layout;
};
export const selectOptimalSheet = (
  dimensions: Dimensions,
  thickness: number,
  quantity: number
): {
  optimalSheet: Sheet;
  totalMaterialCost: number;
  layout: LayoutItem[];
  sheetsNeeded: number;
} => {
  let optimalSheet: Sheet | null = null;
  let minCost = Number.MAX_SAFE_INTEGER;
  let bestLayout: LayoutItem[] = [];
  let sheetsNeeded = 0;

  for (const panel of ACRYLIC_PANELS as any) {
    if (panel.fee[thickness] === null) continue;

    const sheet: Sheet = {
      width: panel.width + CUT_LOSS,
      height: panel.height + CUT_LOSS,
      name: panel.name,
      price: panel.fee[thickness],
    };

    const layout = fitPartsOnSheet(dimensions, sheet, quantity);
    const partsPerSheet = layout.length;
    const totalParts = Object.keys(dimensions).length * quantity;
    const sheetsForQuantity = Math.ceil(totalParts / partsPerSheet);
    const totalMaterialCost = sheet.price * sheetsForQuantity;

    if (totalMaterialCost < minCost) {
      optimalSheet = sheet;
      minCost = totalMaterialCost;
      bestLayout = layout;
      sheetsNeeded = sheetsForQuantity;
    }
  }

  if (!optimalSheet) {
    throw new Error('No suitable sheet found for the given thickness');
  }

  return {
    optimalSheet,
    totalMaterialCost: minCost,
    layout: bestLayout,
    sheetsNeeded,
  };
};

export const calculateTotalCost = (
  totalMaterialCost: number,
  laborCostFactor: number
): number => {
  return totalMaterialCost * laborCostFactor;
};
