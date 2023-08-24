import { useMemo } from 'react';
import dayjs from 'dayjs';
import { findData, getDateFormat, getReportTypeFromKey } from 'renderer/utils';
import AtikTable from './AtikTable';

export default function AtikTables({ tableData, tableKeys }: any) {
  const tables = useMemo(() => {
    if (!tableData || !tableKeys || tableKeys.length === 0) {
      return null;
    }

    return tableKeys.map((tableKey: string) => {
      return findData(tableData, tableKey);
    });
  }, [tableData, tableKeys]);

  if (!tables || tables.length === 0) {
    return null;
  }
  return (
    <div className="flex flex-row flex-wrap justify-center flex-1 overflow-auto">
      {tables.map((table: any, index: number) => {
        const reportType = getReportTypeFromKey(tableKeys[index]);
        return (
          <div
            key={table.date}
            className="max-h-[calc(100vh_-_12.5rem)] ml-12 mb-12"
          >
            <AtikTable
              options={{
                date: dayjs(table.date, getDateFormat(reportType)),
                data: table.tableData,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
