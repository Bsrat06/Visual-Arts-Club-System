import React from "react";

const Table = ({ children }) => {
  return (
    <table className="table-auto w-full border-collapse border border-gray-200">
      {children}
    </table>
  );
};

export default Table;
