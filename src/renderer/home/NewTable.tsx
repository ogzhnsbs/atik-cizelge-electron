import React from 'react';
import AtikTable from 'renderer/components/AtikTable';

export default function NewTable() {
  return (
    <div className="p-12 flex flex-col max-h-full h-full">
      <h1 className="text-3xl mr-4 mb-4 ">Atık Takip Çizelgesi</h1>
      <div className="flex-1 overflow-hidden">
        <AtikTable options={{ newTable: true }} />
      </div>
    </div>
  );
}
