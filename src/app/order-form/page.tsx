'use client';

import React, { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const thicknessOptions = [
  1, 1.3, 1.5, 1.8, 2, 2.5, 3, 4, 4.5, 5, 6, 7, 8, 9, 10, 12, 15, 18, 20, 25,
  30,
];

const specificationOptions = [
  '3*6판',
  '대3*6판',
  '1*2판',
  '4*5판',
  '대4*5판',
  '4*6판',
  '4*8판',
];

const surfaceTreatmentOptions = [
  '유광',
  '단면 아스텔',
  '양면 아스텔',
  '단면 사틴',
  '양면 사틴',
];

interface BusinessInfo {
  name: string;
  info: string;
}

const senderOptions: BusinessInfo[] = [
  {
    name: '미광산업',
    info: '아크릴 레이저 가공/다이아 컷팅/아크릴 경첩 및 사출제품 업체\n(우)100-194 서울특별시 중구 을지로 33길 34-4\nTEL: 02)2265-2474 / Fax: 02)2263-5975',
  },
  {
    name: '아크릴맛집',
    info: '사업자등록번호: 382-75-00268 \n주소: 서울특별시 중구 을지로33길 33, 청자빌딩 201호\n연락처: 010-2410-2474',
  },
];

interface Item {
  productName: string;
  thickness: number;
  specification: string;
  surfaceTreatment: string;
  surfaceTreatmentType: string;
  quantity: number;
}

const OrderFormPage: React.FC = () => {
  // 초기 상태값 정의
  const initialState = {
    items: [
      {
        productName: '',
        thickness: 1.3,
        specification: '3*6판',
        surfaceTreatment: '',
        surfaceTreatmentType: '',
        quantity: 1,
      },
    ],
    recipient: '청구산업',
    sender: senderOptions[0].name,
    orderDate: new Date().toISOString().split('T')[0],
    specialNotes: '',
  };

  // useState 초기값을 localStorage에서 가져오거나 초기값 사용
  const [items, setItems] = useState<Item[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('orderForm_items');
      return saved ? JSON.parse(saved) : initialState.items;
    }
    return initialState.items;
  });

  const [recipient, setRecipient] = useState(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('orderForm_recipient') || initialState.recipient
      );
    }
    return initialState.recipient;
  });

  const [sender, setSender] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('orderForm_sender') || initialState.sender;
    }
    return initialState.sender;
  });

  const [orderDate, setOrderDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const [specialNotes, setSpecialNotes] = useState(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('orderForm_specialNotes') ||
        initialState.specialNotes
      );
    }
    return initialState.specialNotes;
  });

  // localStorage 저장 함수들
  useEffect(() => {
    localStorage.setItem('orderForm_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('orderForm_recipient', recipient);
  }, [recipient]);

  useEffect(() => {
    localStorage.setItem('orderForm_sender', sender);
  }, [sender]);

  useEffect(() => {
    localStorage.setItem('orderForm_specialNotes', specialNotes);
  }, [specialNotes]);

  // 초기화 함수
  const handleReset = () => {
    setItems(initialState.items);
    setRecipient(initialState.recipient);
    setSender(initialState.sender);
    setOrderDate(new Date().toISOString().split('T')[0]);
    setSpecialNotes(initialState.specialNotes);

    // localStorage 초기화
    localStorage.removeItem('orderForm_items');
    localStorage.removeItem('orderForm_recipient');
    localStorage.removeItem('orderForm_sender');
    localStorage.removeItem('orderForm_specialNotes');
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        productName: '',
        thickness: 1.3,
        specification: '36판',
        surfaceTreatment: '',
        surfaceTreatmentType: '',
        quantity: 1,
      },
    ]);
  };

  // 삭제
  const deleteItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const handleChangeItem = (
    index: number,
    field: keyof Item,
    value: string | number,
    isCustomInput: boolean = false
  ) => {
    const newItems = [...items];
    if (field === 'thickness' || field === 'quantity') {
      newItems[index][field] = Number(value);
    } else if (field === 'surfaceTreatment') {
      if (isCustomInput) {
        // 직접 입력 시에는 입력된 값을 저장하고 custom 상태를 유지
        newItems[index].surfaceTreatmentType = 'custom';
        newItems[index].surfaceTreatment = value as string;
      } else {
        // select 변경 시
        newItems[index].surfaceTreatmentType = value as string;
        newItems[index].surfaceTreatment =
          value === 'custom' ? '' : (value as string);
      }
    } else {
      newItems[index][field] = value as string;
    }
    setItems(newItems);
  };

  const printRef = useRef<HTMLDivElement>(null);

  const handleGeneratePDF = async () => {
    const element = document.getElementById('pdf-content');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: true,
        allowTaint: true,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById('pdf-content');
          if (clonedElement instanceof HTMLElement) {
            const styles = window.getComputedStyle(element);
            clonedElement.style.fontFamily = styles.fontFamily;
          }
        },
      });
      const imgData = canvas.toDataURL('image/png');
      // A4 크기 설정 (단위: mm)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('order_form.pdf');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownloadImage = async () => {
    if (printRef.current) {
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        onclone: (clonedDoc) => {
          const element = clonedDoc.querySelector(
            '.print-content'
          ) as HTMLElement;
          if (element) {
            element.style.height = '297mm';
            element.style.width = '210mm';
          }
        },
      });

      const imageData = canvas.toDataURL('image/jpeg', 1.0);
      const link = document.createElement('a');
      link.download = '재료주문서.jpg';
      link.href = imageData;
      link.click();
    }
  };

  return (
    <div className="p-4 bg-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">재료 주문서 작성</h1>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          초기화
        </button>
      </div>

      {/* 입력 폼 */}
      <div className="mb-4 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              받는 사람
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="받는 사람을 입력하세요"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              보내는 사람
            </label>
            <select
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              className="w-full p-2 border rounded"
            >
              {senderOptions.map((option) => (
                <option key={option.name} value={option.name}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              날짜
            </label>
            <input
              type="date"
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              특이사항
            </label>
            <textarea
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              className="w-full p-2 border rounded"
              rows={3}
              placeholder="특이사항을 입력하세요."
            />
          </div>
        </div>

        {items.map((item, index) => (
          <div key={index} className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                품명
              </label>
              <input
                type="text"
                value={item.productName}
                onChange={(e) =>
                  handleChangeItem(index, 'productName', e.target.value)
                }
                className="w-full p-2 border rounded"
                placeholder="품명을 입력하세요"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                두께
              </label>
              <select
                value={item.thickness}
                onChange={(e) =>
                  handleChangeItem(index, 'thickness', e.target.value)
                }
                className="w-full p-2 border rounded"
              >
                {thicknessOptions.map((thickness) => (
                  <option key={thickness} value={thickness}>
                    {thickness}T
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                규격
              </label>
              <select
                value={item.specification}
                onChange={(e) =>
                  handleChangeItem(index, 'specification', e.target.value)
                }
                className="w-full p-2 border rounded"
              >
                {specificationOptions.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                표면처리
              </label>
              <div className="flex gap-2">
                <select
                  value={
                    items[index].surfaceTreatmentType ||
                    items[index].surfaceTreatment
                  }
                  onChange={(e) =>
                    handleChangeItem(index, 'surfaceTreatment', e.target.value)
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="">선택하세요</option>
                  {surfaceTreatmentOptions.map((treatment) => (
                    <option key={treatment} value={treatment}>
                      {treatment}
                    </option>
                  ))}
                  <option value="custom">직접 입력</option>
                </select>
                {items[index].surfaceTreatmentType === 'custom' && (
                  <input
                    type="text"
                    value={items[index].surfaceTreatment}
                    onChange={(e) =>
                      handleChangeItem(
                        index,
                        'surfaceTreatment',
                        e.target.value,
                        true
                      )
                    }
                    className="w-full p-2 border rounded"
                    placeholder="표면처리를 입력하세요"
                  />
                )}
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                수량
              </label>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  handleChangeItem(index, 'quantity', e.target.value)
                }
                className="w-full p-2 border rounded"
                placeholder="수량을 입력하세요"
              />
            </div>
            <button
              type="button"
              onClick={() => deleteItem(index)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              삭제
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddItem}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          항목 추가
        </button>
      </div>

      {/* A4 미리보기 */}
      <div
        id="pdf-content"
        className="print-content mx-auto bg-white shadow-lg"
        ref={printRef}
        style={{
          width: '210mm',
          height: '297mm',
          padding: '20mm',
          position: 'relative',
        }}
      >
        {/* 주문서 제목 */}
        <h2 className="text-2xl font-bold text-center mb-8">재료 주문서</h2>

        {/* 받는 사람 */}
        <div className="mb-6 flex justify-between items-start">
          <div>
            <p className="text-lg">
              <strong>받는 사람:</strong> {recipient}
            </p>
          </div>
          <div className="text-right whitespace-pre-line text-sm">
            {senderOptions.find((opt) => opt.name === sender)?.info}
          </div>
        </div>

        {/* 주문 테이블 */}
        <table
          className="w-full mb-6"
          style={{
            borderCollapse: 'collapse',
            borderSpacing: 0,
            fontFamily:
              '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
          }}
        >
          <thead>
            <tr>
              <th
                className="border bg-gray-50 text-base"
                style={{
                  height: '45px',
                  padding: '0 8px',
                  display: 'table-cell',
                  verticalAlign: 'middle',
                  textAlign: 'center',
                }}
              >
                제품명
              </th>
              <th
                className="border bg-gray-50 text-base"
                style={{
                  height: '45px',
                  padding: '0 8px',
                  display: 'table-cell',
                  verticalAlign: 'middle',
                  textAlign: 'center',
                }}
              >
                두께
              </th>
              <th
                className="border bg-gray-50 text-base"
                style={{
                  height: '45px',
                  padding: '0 8px',
                  display: 'table-cell',
                  verticalAlign: 'middle',
                  textAlign: 'center',
                }}
              >
                규격
              </th>
              <th
                className="border bg-gray-50 text-base"
                style={{
                  height: '45px',
                  padding: '0 8px',
                  display: 'table-cell',
                  verticalAlign: 'middle',
                  textAlign: 'center',
                }}
              >
                표면처리
              </th>
              <th
                className="border bg-gray-50 text-base"
                style={{
                  height: '45px',
                  padding: '0 8px',
                  display: 'table-cell',
                  verticalAlign: 'middle',
                  textAlign: 'center',
                }}
              >
                수량
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 10 }).map((_, index) => {
              const item = items[index] || {
                productName: '',
                thickness: 0,
                specification: '',
                surfaceTreatment: '',
                surfaceTreatmentType: '',
                quantity: 0,
              };
              return (
                <tr key={index}>
                  <td
                    className="border"
                    style={{
                      height: '45px',
                      padding: '0 8px',
                      display: 'table-cell',
                      verticalAlign: 'middle',
                      textAlign: 'center',
                      fontSize: '14px',
                    }}
                  >
                    {item.productName || ' '}
                  </td>
                  <td
                    className="border"
                    style={{
                      height: '45px',
                      padding: '0 8px',
                      display: 'table-cell',
                      verticalAlign: 'middle',
                      textAlign: 'center',
                      fontSize: '14px',
                    }}
                  >
                    {item.thickness === 0 ? ' ' : item.thickness + 'T'}
                  </td>
                  <td
                    className="border"
                    style={{
                      height: '45px',
                      padding: '0 8px',
                      display: 'table-cell',
                      verticalAlign: 'middle',
                      textAlign: 'center',
                      fontSize: '14px',
                    }}
                  >
                    {item.specification || ' '}
                  </td>
                  <td
                    className="border"
                    style={{
                      height: '45px',
                      padding: '0 8px',
                      display: 'table-cell',
                      verticalAlign: 'middle',
                      textAlign: 'center',
                      fontSize: '14px',
                    }}
                  >
                    {item.surfaceTreatment || ' '}
                  </td>
                  <td
                    className="border"
                    style={{
                      height: '45px',
                      padding: '0 8px',
                      display: 'table-cell',
                      verticalAlign: 'middle',
                      textAlign: 'center',
                      fontSize: '14px',
                    }}
                  >
                    {item.quantity === 0 ? ' ' : item.quantity}
                  </td>
                </tr>
              );
            })}
            <tr>
              <td
                colSpan={5}
                className="border px-2 text-left"
                style={{
                  height: '80px',
                  verticalAlign: 'top',
                  padding: '10px',
                }}
              >
                <strong>특이사항:</strong> {specialNotes || ' '}
              </td>
            </tr>
          </tbody>
        </table>

        {/* 특이사항과 날짜 */}
        <div className="flex justify-between items-start mt-4">
          <div className="flex-grow"></div>
          <div className="text-right">{orderDate}</div>
        </div>

        {/* 보내는 사람 */}
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            right: '20px',
          }}
        >
          <p className="text-lg">
            <strong>보내는 사람:</strong> {sender}
          </p>
        </div>
      </div>

      {/* 다운로드 버튼 */}
      <div className="mt-4 flex gap-4 justify-center">
        <button
          onClick={handleGeneratePDF}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          PDF 다운로드
        </button>
        <button
          onClick={handleDownloadImage}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          JPG 다운로드
        </button>
      </div>
    </div>
  );
};

export default OrderFormPage;
