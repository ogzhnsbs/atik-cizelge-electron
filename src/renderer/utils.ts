import React from 'react';
import { DataNode } from 'antd/es/tree';
import { flatten } from 'flat';

export const getParentKey = (key: React.Key, tree: DataNode[]): React.Key => {
  let parentKey: React.Key;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item) => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey!;
};
export type ReportType = 'DAILY' | 'MONTHLY' | 'YEARLY';

export function getLevel(reportType: ReportType) {
  switch (reportType) {
    case 'YEARLY':
      return 1;
    case 'MONTHLY':
      return 2;
    case 'DAILY':
      return 3;
    default:
      return 1;
  }
}

export function getLevelFromKey(key: string) {
  const pieces = key.split('.').length;
  return pieces;
}

export function getReportTypeFromKey(key: string) {
  const pieces = key.split('.').length;
  switch (pieces) {
    case 1:
      return 'YEARLY';
    case 2:
      return 'MONTHLY';
    case 3:
      return 'DAILY';
    default:
      return 'YEARLY';
  }
}

export function getDateFormat(reportType: ReportType) {
  switch (reportType) {
    case 'YEARLY':
      return 'YYYY';
    case 'MONTHLY':
      return 'YYYY.MM';
    case 'DAILY':
      return 'YYYY.MM.DD';
    default:
      return 'YYYY.MM.DD';
  }
}

function compareTableDataKey(a: DataNode, b: DataNode) {
  if (!a?.title || !b?.title) {
    return 0;
  }

  if (a.title < b.title) {
    return -1;
  }
  if (a?.title > b?.title) {
    return 1;
  }
  return 0;
}

export const generateTableData = (
  dataObject: any,
  key: string,
  level: number
): DataNode[] | null => {
  if (!dataObject || level <= 0) {
    return null;
  }

  return Object.keys(dataObject).map((itemKey) => {
    const currentKey = `${key}${key ? '.' : ''}${itemKey}`;
    return {
      title: currentKey,
      key: currentKey,
      children:
        dataObject[itemKey]?.date ||
        typeof dataObject[itemKey] === 'string' ||
        Array.isArray(dataObject[itemKey])
          ? null
          : generateTableData(dataObject[itemKey], currentKey, level - 1)?.sort(
              compareTableDataKey
            ),
    } as DataNode;
  });
};

export function stringToNumber(value: string) {
  const num = parseFloat(value);
  return Number.isNaN(num) ? 0 : num;
}

export function findData(tableData: any, tableKey: string) {
  const keys = tableKey.split('.');

  const result = keys.reduce((a: any, key: string) => a[key], tableData);
  if (result.date) {
    return result;
  }

  const flattenResult: any = flatten(result, {
    delimiter: '.',
    maxDepth: 3 - tableKey.split('.').length,
  });

  let aggregatedTableData: any;

  Object.values(flattenResult).forEach((value: any) => {
    if (!aggregatedTableData) {
      aggregatedTableData = JSON.parse(JSON.stringify(value.tableData));
      return;
    }

    for (let i = 0; i < aggregatedTableData.length; i++) {
      for (let j = 0; j < aggregatedTableData[i].length; j++) {
        aggregatedTableData[i][j].value =
          stringToNumber(aggregatedTableData[i][j].value) +
          stringToNumber(value.tableData[i][j].value);
        if (!aggregatedTableData[i][j].value) {
          aggregatedTableData[i][j].value = '';
        }
      }
    }
  });

  return { date: tableKey, tableData: aggregatedTableData };
}
