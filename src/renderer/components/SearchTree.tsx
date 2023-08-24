import React, { useMemo, useState } from 'react';
import { Input, Space, Select, Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import {
  ReportType,
  generateTableData,
  getLevel,
  getParentKey,
} from 'renderer/utils';

const { Search } = Input;

export default function SearchTree({
  tableList,
  checkedKeys,
  setCheckedKeys,
  levelFilter,
}: any) {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [dataList, setDataList] = useState<DataNode[]>(
    generateTableData(tableList, '', getLevel('DAILY')) || []
  );

  const onExpand = (newExpandedKeys: React.Key[]) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const newExpandedKeys = dataList
      .map((item: any) => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, dataList);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    setExpandedKeys(newExpandedKeys as React.Key[]);
    setSearchValue(value);
    setAutoExpandParent(true);
  };

  const onCheck: any = (newCheckedKeys: string[]) => {
    const keys: string[] = newCheckedKeys.filter(
      (key1) =>
        newCheckedKeys.filter((key2) => key2.includes(key1)).length === 1
    );

    setCheckedKeys(keys);
  };

  const treeData = useMemo(() => {
    const loop = (data: DataNode[]): DataNode[] =>
      data.map((item) => {
        const strTitle = item.title as string;
        const index = strTitle.indexOf(searchValue);
        const beforeStr = strTitle.substring(0, index);
        const afterStr = strTitle.slice(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span className="text-[#f50]">{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{strTitle}</span>
          );
        if (item.children) {
          return { title, key: item.key, children: loop(item.children) };
        }

        return {
          title,
          key: item.key,
        };
      });

    return loop(dataList);
  }, [searchValue, dataList]);

  return (
    <div>
      <Space wrap className="mb-4">
        {levelFilter && (
          <Select
            defaultValue="DAILY"
            style={{ width: 120 }}
            onChange={(value: ReportType) => {
              setDataList(
                generateTableData(tableList, '', getLevel(value)) || []
              );
              setCheckedKeys([]);
            }}
            options={[
              { value: 'DAILY', label: 'Günlük' },
              { value: 'MONTHLY', label: 'Aylık' },
              { value: 'YEARLY', label: 'Yıllık' },
            ]}
          />
        )}
        <Search placeholder="Search" onChange={onChange} />
      </Space>
      <Tree
        checkable
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        treeData={treeData}
        checkedKeys={checkedKeys}
        onCheck={onCheck}
      />
    </div>
  );
}
