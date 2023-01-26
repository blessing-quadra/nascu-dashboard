import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";

export const DataTable = ({ tableProps }) => {
  const pageSize = tableProps.pageSize ? tableProps.pageSize : 10;
  return (
    <div
      className={tableProps?.rows?.length > 0 ? "h-[400px]" : "h-auto py-10"}
      style={{ width: "100%" }}
    >
      {tableProps.rows?.length > 0 && (
        <DataGrid
          rows={tableProps.rows}
          columns={tableProps.columns}
          pageSize={pageSize}
          rowsPerPageOptions={[pageSize]}
          // rowsPerPageOptions={[tableProps.rows.length]}
          checkboxSelection={false}
        />
      )}
      {tableProps.rows?.length === 0 && (
        <div className="flex flex-col items-center">
          {tableProps.icon}
          <p className="text-md text-gray-500">{tableProps.emptyDataText}</p>
        </div>
      )}
    </div>
  );
};

// {
//   /* <DataGrid
// rows={rows}
// columns={columns}
// pageSize={5}
// rowsPerPageOptions={[5]}
// checkboxSelection
// /> */
// }
