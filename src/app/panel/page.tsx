'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { Button } from '../ui/button';
import { ACRYLIC_PANELS } from '../utils/acrylicPanel';

const thicknessOptions = [
  { value: 1, label: '1T' },
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

type FeeType = {
  [key: number]: number | null;
};

interface PanelType {
  name: string;
  width: number;
  height: number;
  fee: FeeType;
}

interface ResultType {
  panel: PanelType;
  count: number;
  layout: { horizontal: number; vertical: number };
  fee: number;
  pricePerItem: number;
}

const PanelSystemPage: React.FC = () => {
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [thickness, setThickness] = useState<number>(2);
  const [results, setResults] = useState<ResultType[]>([]);
  const [bestOption, setBestOption] = useState<ResultType | null>(null);

  useEffect(() => {
    setWidth(localStorage.getItem('panel_width') || '');
    setHeight(localStorage.getItem('panel_height') || '');
    setThickness(Number(localStorage.getItem('panel_thickness')) || 2);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const itemWidth = Number(width);
    const itemHeight = Number(height);

    const calculatedResults = ACRYLIC_PANELS.map((panel: PanelType) => {
      const horizontalCount = Math.floor(panel.width / itemWidth);
      const verticalCount = Math.floor(panel.height / itemHeight);
      const totalCount = horizontalCount * verticalCount;
      const fee = panel.fee[thickness];

      if (fee === null) return null;

      const pricePerItem = fee / totalCount;

      return {
        panel: panel,
        count: totalCount,
        layout: { horizontal: horizontalCount, vertical: verticalCount },
        fee: fee,
        pricePerItem: pricePerItem,
      };
    }).filter((result): result is ResultType => result !== null);

    const sortedResults = calculatedResults.sort(
      (a, b) => a.pricePerItem - b.pricePerItem
    );
    setBestOption(sortedResults[0] || null);
    setResults(sortedResults);
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setWidth(value);
    localStorage.setItem('panel_width', value);
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHeight(value);
    localStorage.setItem('panel_height', value);
  };

  const handleThicknessChange = (value: string) => {
    const numValue = Number(value);
    setThickness(numValue);
    localStorage.setItem('panel_thickness', String(numValue));
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6">아크릴 판재 계산기</h1>
      <form
        onSubmit={handleSubmit}
        className="mb-8 bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow-md"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="width" className="block mb-1 font-semibold">
              가로 (mm)
            </label>
            <Input
              type="number"
              id="width"
              value={width}
              onChange={handleWidthChange}
              required
            />
          </div>
          <div>
            <label htmlFor="height" className="block mb-1 font-semibold">
              세로 (mm)
            </label>
            <Input
              type="number"
              id="height"
              value={height}
              onChange={handleHeightChange}
              required
            />
          </div>
          <div>
            <label htmlFor="thickness" className="block mb-1 font-semibold">
              두께
            </label>
            <Select
              id="thickness"
              value={thickness}
              onValueChange={handleThicknessChange}
              options={thicknessOptions}
            />
          </div>
        </div>
        <Button type="submit">계산하기</Button>
      </form>
      {bestOption && (
        <div className="mb-8 p-6 bg-green-100 dark:bg-green-800 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">최적 옵션</h2>
          <p className="mb-2">
            <span className="font-semibold">판재:</span> {bestOption.panel.name}{' '}
            ({bestOption.panel.width} x {bestOption.panel.height} mm)
          </p>
          <p className="mb-2">
            <span className="font-semibold">개당 가격:</span>{' '}
            {Math.round(bestOption.pricePerItem).toLocaleString()}원
          </p>
          <p className="mb-2">
            <span className="font-semibold">총 제작 개수:</span>{' '}
            {bestOption.count}개
          </p>
          <p>
            <span className="font-semibold">총 가격:</span>{' '}
            {bestOption.fee.toLocaleString()}원
          </p>
        </div>
      )}
      {results.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">계산 결과</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((result, index) => (
              <div
                key={index}
                className="p-4 border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="font-bold mb-2 text-lg">
                  {result.panel.name} ({result.panel.width} x{' '}
                  {result.panel.height} mm)
                </h3>
                <div
                  className="relative w-full mb-4"
                  style={{ paddingBottom: '75%' }}
                >
                  <div className="absolute inset-0 border border-gray-400">
                    {Array.from({ length: result.layout.vertical }).map(
                      (_, y) =>
                        Array.from({ length: result.layout.horizontal }).map(
                          (_, x) => (
                            <div
                              key={`${x}-${y}`}
                              className="absolute border border-gray-600 flex items-center justify-center text-xs"
                              style={{
                                left: `${
                                  (x * 100) / result.layout.horizontal
                                }%`,
                                top: `${(y * 100) / result.layout.vertical}%`,
                                width: `${100 / result.layout.horizontal}%`,
                                height: `${100 / result.layout.vertical}%`,
                                backgroundColor: `hsl(${
                                  (index * 40) % 360
                                }, 70%, 80%)`,
                              }}
                            >
                              {width}x{height}
                            </div>
                          )
                        )
                    )}
                  </div>
                </div>
                <p className="mb-1 font-bold">
                  <span className="font-bold">제작 가능 개수:</span>{' '}
                  {result.count}개
                </p>
                <p className="mb-1">
                  <span className="font-semibold">배치:</span> 가로{' '}
                  {result.layout.horizontal}개, 세로 {result.layout.vertical}개
                </p>
                <p className="mb-1">
                  <span className="font-semibold">판재 가격:</span>{' '}
                  {result.fee.toLocaleString()}원
                </p>
                <p className="font-semibold text-lg">
                  개당 가격: {Math.round(result.pricePerItem).toLocaleString()}
                  원
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PanelSystemPage;
