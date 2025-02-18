import React from "react";

const Table = ({ headers = [], data = [], title = "", subtitle = "" }) => {
  if (!Array.isArray(data)) {
    console.error("Table received invalid data:", data);
    return null;
  }

  return (
    <div className="w-full">
      {/* ✅ Title Section Above the Table */}
      <div className="w-full bg-white h-[130px] flex flex-col justify-center px-6 shadow-md rounded-md">
        <h2 className="text-black text-[22px] font-semibold font-[Poppins]">
          {title}
        </h2>
        <p className="text-gray-500 text-sm font-[Poppins] mt-1">{subtitle}</p>
      </div>

      {/* ✅ Table */}
      <table className="table-auto w-full border-collapse border border-gray-200 mt-4">
        <thead>
          <tr className="text-sm text-[#B5B7C0] bg-white border-b">
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
              <tr key={index} className="text-center border-b border-[#EEEEEE] hover:bg-gray-50">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-2">{cell}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
