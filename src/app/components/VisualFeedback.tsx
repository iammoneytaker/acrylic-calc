import React, { useRef, useEffect } from 'react';

interface VisualFeedbackProps {
  dimensions: { [key: string]: { width: number; height: number } };
  optimalSheet: { width: number; height: number; name: string };
  layout: {
    x: number;
    y: number;
    width: number;
    height: number;
    part: string;
  }[];
  sheetsNeeded: number;
}

const colors = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#FFA07A',
  '#98D8C8',
  '#F7DC6F',
  '#BB8FCE',
  '#82E0AA',
  '#F1948A',
  '#85C1E9',
];

const partLabels: any = {
  top: '상단',
  bottom: '하단',
  left: '왼쪽',
  right: '오른쪽',
  front: '앞면',
  back: '뒷면',
};
export const VisualFeedback: React.FC<VisualFeedbackProps> = ({
  dimensions,
  optimalSheet,
  layout,
  sheetsNeeded,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scale = Math.min(600 / optimalSheet.width, 400 / optimalSheet.height);
    canvas.width = optimalSheet.width * scale;
    canvas.height = optimalSheet.height * scale * sheetsNeeded;

    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    layout.forEach((item, index) => {
      ctx.fillStyle = colors[index % colors.length];
      ctx.fillRect(
        item.x * scale,
        item.y * scale,
        item.width * scale,
        item.height * scale
      );
      ctx.strokeStyle = '#000';
      ctx.strokeRect(
        item.x * scale,
        item.y * scale,
        item.width * scale,
        item.height * scale
      );

      ctx.fillStyle = '#000';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const label = `${partLabels[item.part]}`;
      const size = `${item.width}x${item.height}`;
      ctx.fillText(
        label,
        (item.x + item.width / 2) * scale,
        (item.y + item.height / 2 - 10) * scale
      );
      ctx.fillText(
        size,
        (item.x + item.width / 2) * scale,
        (item.y + item.height / 2 + 10) * scale
      );
    });

    // Draw sheet separators
    for (let i = 1; i < sheetsNeeded; i++) {
      ctx.strokeStyle = '#ff0000';
      ctx.beginPath();
      ctx.moveTo(0, i * optimalSheet.height * scale);
      ctx.lineTo(canvas.width, i * optimalSheet.height * scale);
      ctx.stroke();
    }
  }, [dimensions, optimalSheet, layout, sheetsNeeded]);

  return (
    <div>
      <h3 className="text-lg font-bold mb-2">최적 아크릴 판 배치</h3>
      <p className="mb-2">
        선택된 아크릴 판: {optimalSheet.name} ({optimalSheet.width} x{' '}
        {optimalSheet.height} mm)
      </p>
      <canvas ref={canvasRef} style={{ border: '1px solid black' }}></canvas>
    </div>
  );
};
