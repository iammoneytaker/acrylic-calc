'use client';

import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const thicknessOptions = [
  1.3, 1.5, 1.8, 2, 2.5, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 18, 20, 25, 30,
];

const specificationOptions = [
  '36판', '대36판', '대12판', '45판', '대45판', '대46판', '대48판'
];

interface Item {
  productName: string;
  thickness: number;
  specification: string;
  quantity: number;
}

const OrderFormPage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([
    { productName: '', thickness: 1.3, specification: '36판', quantity: 1 },
  ]);

  const [recipient, setRecipient] = useState('청구산업');
  const [sender, setSender] = useState('미광산업');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().substr(0, 10).replace(/-/g, '.'); // YYYY.MM.DD 형식
  });
  const [specialNotes, setSpecialNotes] = useState('');

  const handleAddItem = () => {
    setItems([
      ...items,
      { productName: '', thickness: 1.3, specification: '36판', quantity: 1 },
    ]);
  };

  const handleChangeItem = (
    index: number,
    field: keyof Item,
    value: string | number
  ) => {
    const newItems = [...items];
    if (field === 'thickness') {
      newItems[index][field] = Number(value); // 두께는 숫자로 변환
    } else if (field === 'quantity') {
      newItems[index][field] = Number(value); // 수량도 숫자로 변환
    } else {
      newItems[index][field] = value as string; // 나머지는 문자열
    }
    setItems(newItems);
  };

  const printRef = useRef<HTMLDivElement>(null);

  const handleGeneratePDF = async () => {
    if (printRef.current) {
      const canvas = await html2canvas(printRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('order_form.pdf');
    }
  };

  return (
    <div className="p-4 bg-white text-gray-900">
      <h1 className="text-2xl font-bold mb-4">재료 주문서 작성</h1>
      <form className="mb-8">
        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input
              type="text"
              value={item.productName}
              onChange={(e) => handleChangeItem(index, 'productName', e.target.value)}
              placeholder="품명"
              className="border border-gray-300 rounded px-2 py-1 text-black"
            />
            <select
              value={item.thickness}
              onChange={(e) => handleChangeItem(index, 'thickness', e.target.value)}
              className="border border-gray-300 rounded px-2 py-1"
            >
              {thicknessOptions.map((thickness) => (
                <option key={thickness} value={thickness}>
                  {thickness}T
                </option>
              ))}
            </select>
            <select
              value={item.specification}
              onChange={(e) => handleChangeItem(index, 'specification', e.target.value)}
              className="border border-gray-300 rounded px-2 py-1"
            >
              {specificationOptions.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => handleChangeItem(index, 'quantity', e.target.value)}
              placeholder="수량"
              className="border border-gray-300 rounded px-2 py-1 text-black"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddItem}
          className="bg-blue-500 text-white rounded px-4 py-2"
        >
          항목 추가
        </button>
        <div className="mt-4 flex space-x-4">
          <button
            type="button"
            onClick={handleGeneratePDF}
            className="bg-blue-500 text-white rounded px-4 py-2"
          >
            PDF로 출력
          </button>
        </div>
      </form>

      {/* 날짜 입력 필드 추가 */}
      <div className="mb-4">
        <label className="block mb-1">날짜</label>
        <input
          type="date"
          value={date.replace(/\./g, '-')} // YYYY-MM-DD 형식으로 변환
          onChange={(e) => setDate(e.target.value.replace(/-/g, '.'))} // YYYY.MM.DD 형식으로 변환
          className="border border-gray-300 rounded px-2 py-1 w-full"
        />
      </div>

      {/* 세부사항 입력 필드 추가 */}
      <div className="mb-4">
        <label className="block mb-1">특이사항</label>
        <textarea
          value={specialNotes}
          onChange={(e) => setSpecialNotes(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 w-full"
          rows={3}
          placeholder="특이사항을 입력하세요."
        />
      </div>

      {/* 출력할 주문서 미리보기 */}
      <div ref={printRef} className="p-4 border border-gray-300">
        <h2 className="text-xl font-bold mb-2">재료 주문서</h2>
        <p>
          <strong>받는 사람:</strong> {recipient}
        </p>
        <p>
          <strong>보내는 사람:</strong> {sender}
        </p>
        <p>
          <strong>날짜:</strong> {date}
        </p>
        <table className="w-full mt-4 border-collapse">
          <thead>
            <tr>
              <th className="border px-2 py-1">품명</th>
              <th className="border px-2 py-1">두께</th>
              <th className="border px-2 py-1">규격</th>
              <th className="border px-2 py-1">수량</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 8 }).map((_, index) => {
              const item = items[index] || { productName: '', thickness: 0, specification: '', quantity: 0 };
            {items.map((item, index) => (
              <tr key={index}>
                <td className="border px-2 py-1">{item.productName}</td>
                <td className="border px-2 py-1">{item.thickness}T</td>
                <td className="border px-2 py-1">{item.specification}</td>
                <td className="border px-2 py-1">{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {specialNotes && (
          <p className="mt-4">
            <strong>특이사항:</strong> {specialNotes}
          </p>
        )}
      </div>
    </div>
  );
};

export default OrderFormPage;
