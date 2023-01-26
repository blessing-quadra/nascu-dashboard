import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";

export const DataTableExtra = ({ tableProps, showPopup }) => {
  const pageSize = tableProps.pageSize ? tableProps.pageSize : 10;
  return (
    <>
      <div
        className={tableProps?.rows?.length > 0 ? "h-[600px]" : "auto py-10"}
        style={{ width: "100%" }}
      >
        {tableProps.rows?.length > 0 && (
          <DataGrid
            rows={tableProps.rows}
            columns={tableProps.columns}
            pageSize={pageSize}
            rowsPerPageOptions={[tableProps.rows.length]}
            checkboxSelection
          />
        )}
        {tableProps.rows?.length === 0 && (
          <div className="flex flex-col items-center">
            {tableProps.icon}
            <p className="text-md text-gray-500">{tableProps.emptyDataText}</p>
            <div className="flex justify-center">
              <Button
                style={{
                  color: "#0F5499",
                  border: "1px solid #0F5499",
                  fontSize: "13.33px",
                  height: "48px",
                  padding: "6px 16px"
                }}
                onClick={showPopup}
              >
                Create Virtual Account
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
