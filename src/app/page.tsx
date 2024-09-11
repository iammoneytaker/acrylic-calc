'use client';

import React, { useState } from 'react';
import { Input } from './ui/input';
import { Select } from './ui/select';
import { Button } from './ui/button';
import { VisualFeedback } from './components/VisualFeedback';
import {
  calculateDimensions,
  selectOptimalSheet,
  calculateTotalCost,
} from './utils/calculation';

const thicknessOptions = [
  { value: 1.3, label: '1.3T' },
  { value: 1.5, label: '1.5T' },
  { value: 1.8, label: '1.8T' },
  { value: 2, label: '2T' },
  { value: 2.5, label: '2.5T' },
  { value: 3, label: '3T' },
  { value: 4, label: '4T' },
  { value: 5, label: '5T' },
  { value: 6, label: '6T' },
  { value: 7, label: '7T' },
  { value: 8, label: '8T' },
  { value: 9, label: '9T' },
  { value: 10, label: '10T' },
  { value: 12, label: '12T' },
  { value: 15, label: '15T' },
  { value: 18, label: '18T' },
  { value: 20, label: '20T' },
  { value: 25, label: '25T' },
  { value: 30, label: '30T' },
];

// laborCostFactorOptions 배열 제거

interface ResultType {
  dimensions: { [key: string]: { width: number; height: number } };
  optimalSheet: {
    width: number;
    height: number;
    name: string;
    price: number;
  };
  costPerBox: number;
  totalMaterialCost: number;
  totalCost: number;
  layout: {
    x: number;
    y: number;
    width: number;
    height: number;
    part: string;
  }[];
  sheetsNeeded: number;
}

const Page: React.FC = () => {
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [depth, setDepth] = useState('');
  const [thickness, setThickness] = useState(2);
  const [quantity, setQuantity] = useState('1');
  const [laborCostFactor, setLaborCostFactor] = useState('1'); // 문자열로 변경
  const [result, setResult] = useState<ResultType | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const dimensions = calculateDimensions(
      Number(width),
      Number(height),
      Number(depth),
      thickness
    );
    const { optimalSheet, totalMaterialCost, layout, sheetsNeeded } =
      selectOptimalSheet(dimensions, thickness, Number(quantity));
    const totalCost = calculateTotalCost(
      totalMaterialCost,
      Number(laborCostFactor)
    ); // Number로 변환
    const costPerBox = totalCost / Number(quantity);

    setResult({
      dimensions,
      optimalSheet,
      totalMaterialCost,
      costPerBox,
      totalCost,
      layout,
      sheetsNeeded,
    });
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-4">아크릴 박스 자동 견적</h1>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="width" className="block mb-1">
              가로 (mm)
            </label>
            <Input
              type="number"
              id="width"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="height" className="block mb-1">
              세로 (mm)
            </label>
            <Input
              type="number"
              id="height"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="depth" className="block mb-1">
              높이 (mm)
            </label>
            <Input
              type="number"
              id="depth"
              value={depth}
              onChange={(e) => setDepth(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="thickness" className="block mb-1">
              두께
            </label>
            <Select
              id="thickness"
              value={thickness}
              onValueChange={(value) => setThickness(Number(value))}
              options={thicknessOptions}
            />
          </div>

          <div>
            <label htmlFor="quantity" className="block mb-1">
              수량
            </label>
            <Input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="laborCostFactor" className="block mb-1">
              인건비 계수
            </label>
            <input
              type="number"
              id="laborCostFactor"
              value={laborCostFactor}
              onChange={(e) => setLaborCostFactor(e.target.value)}
              required
              min="0.1"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <Button type="submit">견적 계산하기</Button>
      </form>
      {result && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">견적 결과</h2>
          <VisualFeedback
            dimensions={result.dimensions}
            optimalSheet={result.optimalSheet}
            layout={result.layout}
            sheetsNeeded={result.sheetsNeeded}
          />
          <div className="mt-4">
            <p>
              선택된 아크릴 판: {result.optimalSheet.name} (
              {result.optimalSheet.width} x {result.optimalSheet.height} mm)
            </p>
            <p>필요한 아크릴 판 수: {result.sheetsNeeded}장</p>
            <p>총 재료 비용: {Math.round(result.totalMaterialCost)} 원</p>
            <p>인건비 계수: {laborCostFactor}배</p>
            <p>총 금액 (인건비 포함): {Math.round(result.totalCost)} 원</p>
            <p>박스 당 가격: {Math.round(result.costPerBox)} 원</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
