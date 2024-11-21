'use client';

import React, { useState } from 'react';
import { NewInput } from '../ui/NewInput';
import { NewSelect } from '../ui/NewSelect';
import { Button } from '../ui/button';

const thicknessOptions = Array.from({ length: 30 }, (_, i) => ({
  value: (i + 1).toString(), // string으로 변경
  label: `${i + 1}T`,
}));

const panelOptions = [
  { value: 'CKA-36판', label: 'CKA-36판' },
  { value: '대36판', label: '대36판' },
  { value: '대48판', label: '대48판' },
];

const OrderPage: React.FC = () => {
  const [items, setItems] = useState([
    {
      productName: '',
      panel: '',
      thickness: thicknessOptions[0].value,
      quantity: 1,
    },
  ]);

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        productName: '',
        panel: '',
        thickness: thicknessOptions[0].value,
        quantity: 1,
      },
    ]);
  };

  const handleChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 주문서 제출 로직 추가
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-4">재료 주문서</h1>
      <form onSubmit={handleSubmit} className="mb-8">
        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-1 gap-4 mb-4">
            <div>
              <label htmlFor={`productName-${index}`} className="block mb-1">
                품명
              </label>
              <NewInput
                id={`productName-${index}`}
                value={item.productName}
                onChange={(e) =>
                  handleChange(index, 'productName', e.target.value)
                }
                required
              />
            </div>
            <div>
              <label htmlFor={`panel-${index}`} className="block mb-1">
                규격
              </label>
              <NewSelect
                id={`panel-${index}`}
                value={item.panel}
                onValueChange={(value) => handleChange(index, 'panel', value)}
                options={panelOptions}
              />
            </div>
            <div>
              <label htmlFor={`thickness-${index}`} className="block mb-1">
                두께
              </label>
              <NewSelect
                id={`thickness-${index}`}
                value={item.thickness}
                onValueChange={(value) =>
                  handleChange(index, 'thickness', value)
                }
                options={thicknessOptions}
              />
            </div>
            <div>
              <label htmlFor={`quantity-${index}`} className="block mb-1">
                수량
              </label>
              <NewInput
                type="number"
                id={`quantity-${index}`}
                value={item.quantity}
                onChange={(e) =>
                  handleChange(index, 'quantity', Number(e.target.value))
                }
                required
              />
            </div>
          </div>
        ))}
        <Button type="button" onClick={handleAddItem}>
          항목 추가
        </Button>
        <Button type="submit">주문서 제출</Button>
      </form>
    </div>
  );
};

export default OrderPage;
