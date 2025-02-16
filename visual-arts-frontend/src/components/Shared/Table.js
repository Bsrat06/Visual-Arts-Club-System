import React from "react";

const Table = ({ headers = [], data = [] }) => {
  if (!Array.isArray(data)) {
    console.error("Table received invalid data:", data);
    return null;
  }

  return (
    <table className="table-auto w-full border-collapse border border-gray-200">
      <thead>
        <tr className="text-sm text-[#B5B7C0] bg-white">
          {headers.map((header, index) => (
            <th key={index} className="px-4 py-2">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={headers.length} className="text-center py-4">
              No data available.
            </td>
          </tr>
        ) : (
          data.map((row, index) => (
            <tr key={index} className="text-center border-b border-[#EEEEEE]">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-2">{cell}</td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default Table;
