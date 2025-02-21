import React from "react";
import { Table as AntTable } from "antd";
import "../../styles/table.css"; // ✅ Ensure styles are applied

const Table = ({ columns, dataSource, pagination = true, loading }) => {
  if (!Array.isArray(dataSource)) {
    console.error("Table received invalid data:", dataSource);
    return null;
  }

  return (
    <AntTable
      columns={columns} // ✅ Pass the correct columns
      dataSource={dataSource} // ✅ Use correct dataSource
      pagination={pagination ? { pageSizeOptions: ['5', '8', '10', '15', '20', '25', '50', '100'], showSizeChanger: true } : false}
      loading={loading}
      rowKey="key" // ✅ Ensure each row has a unique key
      className="custom-ant-table" // ✅ Apply custom styles
    />
  );
};

export default Table;
