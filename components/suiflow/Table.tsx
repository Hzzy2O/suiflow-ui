import React from 'react';

interface Prop {
  name: string;
  type: string;
  description: string;
}

interface PropsTableProps {
  propsData: Prop[];
}

const PropsTable: React.FC<PropsTableProps> = ({ propsData }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-[#0A1428] border-collapse border-[#2A3746] shadow-lg rounded-lg">
        {/* Table Header */}
        <thead>
          <tr className="bg-[#091428]">
            <th className="px-6 py-3 text-left text-xs font-semibold text-[#6FBCF0] uppercase tracking-wider border-l border-t border-[#2A3746]">Prop Name</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-[#6FBCF0] uppercase tracking-wider border-l border-t border-[#2A3746]">Type</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-[#6FBCF0] uppercase tracking-wider border-l border-t border-[#2A3746] border-r">Description</th>
          </tr>
        </thead>
        {/* Table Body */}
        <tbody>
          {propsData.map((prop, index) => (
            <tr key={index} className={index % 2 === 0 ? "bg-[#0A1428]" : "bg-[#0A2440]/30"}>
              <td className="px-6 py-4 text-sm font-medium text-white border-l border-[#2A3746] border-b">{prop.name}</td>
              <td className="px-6 py-4 text-sm text-[#E9F2FF] border-l border-[#2A3746] border-b">
                <code className="px-2 py-1 bg-[#0A2440]/70 rounded text-[#6FBCF0]">{prop.type}</code>
              </td>
              <td className="px-6 py-4 text-sm text-gray-300 border-l border-[#2A3746] border-b border-r">{prop.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PropsTable;
