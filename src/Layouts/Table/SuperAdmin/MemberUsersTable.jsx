import React from "react";
import { Link } from "react-router-dom";
import { DataTable } from "../../../Components/Table/Table";

function MemberUsersTable({ data }) {
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 80,
    },
    {
      field: "member_fullname",
      headerName: "Members name",
      minWidth: 200,
      flex: 1,
      renderCell: (param) => {
        return (
          <p className="text-center flex justify-center pl-4">{param.value}</p>
        );
      },
    },{
      field: "main_wallet_balance",
      headerName: "Main wallet Balance",
      minWidth: 200,
      flex: 1,
      renderCell: (param) => {
        return (
          <p className="text-center flex justify-center pl-4">{param.value}</p>
        );
      },
    },
    {
      field: "loyalty_wallet_balance",
      headerName: "Loyalty wallet Balance",
      minWidth: 200,
      flex: 1,
      renderCell: (param) => {
        return (
          <p className="text-center flex justify-center pl-4">{param.value}</p>
        );
      },
    },
    {
      field: "fee_wallet_balance",
      headerName: "Fee wallet Balance",
      minWidth: 200,
      flex: 1,
      renderCell: (param) => {
        return (
          <p className="text-center flex justify-center pl-4">{param.value}</p>
        );
      },
    },
    {
      field: "custody_wallet_balance",
      headerName: "Custody wallet Balance",
      minWidth: 200,
      flex: 1,
      renderCell: (param) => {
        return (
          <p className="text-center flex justify-center pl-4">{param.value}</p>
        );
      },
    },
    {
      field: "commission_wallet_balance",
      headerName: "Commission wallet Balance",
      minWidth: 220,
      flex: 1,
      renderCell: (param) => {
        return (
          <p className="text-center flex justify-center pl-4">{param.value}</p>
        );
      },
    },{
      field: "date",
      headerName: "Date",
      minWidth: 220,
      flex: 1,
      renderCell: (param) => {
        return (
          <p className="text-center flex justify-center pl-4">{param.value}</p>
        );
      },
    },
    {
      field: "status",
      headerName: "Branch Officer Status",
      minWidth: 250,
      flex: 1,
      renderCell: (param) => {
        return (
          <div
            className={`${
              param.value === "Active" ? "text-green-600" : "text-red-600"
            }`}
          >
            {param.value}
          </div>
        );
      },
    },
  ];

  const tableProps = {
    columns,
    rows: data,
    icon: "",
    emptyDataText: "No Data is available",
  };
  return (
    <div>
      <DataTable tableProps={tableProps} />
    </div>
  );
}

export default MemberUsersTable;
