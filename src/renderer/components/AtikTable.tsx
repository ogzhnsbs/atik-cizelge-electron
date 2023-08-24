import './AtikTable.css';
import { Button, DatePicker, DatePickerProps, Space, message } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Spreadsheet, { Matrix } from 'react-spreadsheet';
import dayjs from 'dayjs';
import { LockOutlined, UnlockOutlined } from '@ant-design/icons';

export const DATE_FORMAT = 'DD-MM-YYYY - ddd';

const columnLabels = [
  'KAĞIT',
  'CAM',
  'PLASTİK',
  'METAL',
  'ORGANİK',
  'GERİ DÖNÜŞMEYEN',
  'YEMEK',
];

const rowLabels = [
  'A-1',
  'A-2',
  'A-3',
  'A-MUTFAK',
  'B-Z',
  'B-1',
  'B-2',
  'B-3',
  'B-4',
  'B-5',
  'B-Ç.O.',
  'B-6',
  'B-7',
  'C-Z',
  'C-1',
  'C-2',
  'C-3',
  'C-4',
  'C-5',
  'C-Ç.O.',
  'C-6',
  'C-7',
  'C-8',
  'D-Z',
  'D-1',
  'D-2',
  'D-3',
  'D-4',
  'D-5',
  'D-Ç.O.',
  'D-6',
  'D-7',
  'D-8',
  'D-9',
  'E-Z-1-2',
  'E-3',
  'E-YEMEK',
  'B-BŞK.YRD.',
  'ARŞİV',
  'MESCİD',
  'BISTRO',
  'BAHÇE',
  'TEKNİSYEN',
];

function sumOfColumn(data: Matrix<any>, index: number) {
  let sum = 0;
  rowLabels.forEach((_, i) => {
    if (!data[i]) {
      return;
    }
    const cell = parseFloat(data[i][index]?.value);
    sum += Number.isNaN(cell) ? 0 : cell;
  });

  return sum;
}

function AtikTable({
  options,
}: {
  options: { date?: any; data?: any[][]; newTable?: boolean };
}) {
  const [editable, setEditable] = useState(!!options?.newTable);
  const [date, setDate] = useState(
    options?.date ? dayjs(options?.date, 'DD-MM-YYYY - ddd') : null
  );
  function prepareData(data: Matrix<any>, isEditable: boolean) {
    data.forEach((rowData) =>
      rowData.forEach((cellData) => {
        cellData.readOnly = !isEditable;
      })
    );

    return data;
  }

  const initialData =
    options?.newTable || !options?.data
      ? rowLabels.map(() => [...columnLabels.map(() => ({ value: '' }))])
      : options?.data;

  const [tableData, setTableData] = useState<any[][]>(
    prepareData(initialData, editable)
  );

  const onDateChange: DatePickerProps['onChange'] = (newDate) => {
    setDate(newDate);
  };

  const [messageApi, contextHolder] = message.useMessage();

  const saveTable = useCallback(() => {
    if (!date) {
      messageApi.open({
        type: 'error',
        content: 'Lütfen tarih bilgisini giriniz!',
      });
      return;
    }

    try {
      const dateString = `${date?.format('YYYY.MM.DD')}`;
      const key = `table_list.${dateString}`;
      window.electron.store.set(key, {
        date: dateString,
        tableData,
      });

      messageApi.open({
        type: 'success',
        content: 'İşlem başarılı!',
      });
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: 'İşlem başarısız',
      });
    }
  }, [tableData, date, messageApi]);

  const total = useMemo(() => {
    return [
      columnLabels.map((_, index: number) => ({
        value: sumOfColumn(tableData, index),
        readOnly: true,
      })),
    ];
  }, [tableData]);

  const updateData = useCallback(
    (data: Matrix<any>) => {
      const newData = prepareData(data, editable);

      setTableData((oldData) =>
        JSON.stringify(oldData) === JSON.stringify(newData) ? oldData : newData
      );
    },
    [editable]
  );

  useEffect(() => {
    updateData(tableData);
  }, [updateData, tableData]);

  return (
    <div className="wrapper h-full">
      {contextHolder}
      <div className="justify-between flex flex-row">
        <Space wrap className="flex flex-row items-center">
          {editable ? (
            <UnlockOutlined className="text-lg" />
          ) : (
            <LockOutlined className="text-lg text-gray-500" />
          )}
          <DatePicker
            defaultValue={date || undefined}
            disabled={!editable}
            format="DD-MM-YYYY - ddd"
            onChange={onDateChange}
          />
          <Button onClick={() => setEditable((e) => !e)}>
            {editable ? 'Kilitle' : 'Düzenle'}
          </Button>
          <Button type="primary" onClick={saveTable}>
            Kaydet
          </Button>
        </Space>
      </div>

      <div className="data-table mt-4">
        <Spreadsheet
          className="overflow"
          columnLabels={columnLabels}
          rowLabels={rowLabels}
          data={tableData}
          onChange={updateData}
        />
      </div>
      <div className="total-table">
        <Spreadsheet
          columnLabels={columnLabels}
          rowLabels={['TOTAL']}
          data={total}
        />
      </div>
    </div>
  );
}

export default AtikTable;
