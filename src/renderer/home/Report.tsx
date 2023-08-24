import { useState } from 'react';
import AtikTables from 'renderer/components/AtikTables';
import SearchTree from 'renderer/components/SearchTree';

export default function Report() {
  const [tableList] = useState(window.electron.store.get('table_list'));
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);

  return (
    <div className="p-12 max-h-full h-full">
      <div className="text-3xl mb-4 h-10 flex-1 min-h-96">Raporlama</div>
      <div className="flex flex-row flex-1 max-h-[calc(100vh_-_9.5rem)]">
        <SearchTree
          levelFilter
          {...{ tableList, checkedKeys, setCheckedKeys }}
        />

        <div className="flex-1 ml-8 overflow-auto">
          <AtikTables tableData={tableList} tableKeys={checkedKeys} />
        </div>
      </div>
    </div>
  );
}
