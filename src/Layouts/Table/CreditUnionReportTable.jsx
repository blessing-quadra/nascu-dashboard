import React from "react";
import { Link } from "react-router-dom";
import { DataTable } from "../../Components/Table/Table";

function CreditUnionReportTable({ data }) {
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 80,
    },
    {
      field: "transaction_volume",
      headerName: "Transaction Volume",
      minWidth: 180,
      flex: 1,
      renderCell: (param) => {
        return (
          <p className="text-center flex justify-center pl-4">{param.value}</p>
        );
      },
    },
    {
      field: "organizationName",
      headerName: "Organization Name",
      minWidth: 250,
      flex: 1,
    },
    {
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
      headerName: "Credit Union Status",
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
    {
      field: "action",
      headerName: "Action",
      minWidth: 180,
      flex: 1,
      renderCell: (param) => {
        const showDeleteConfirmOverlay = () => {
          setShowOverlay(3);
          setEmployeeIdToRemove(param.row.id);
        };
        return (
          <Link
            to={`/credit-union-admin/reporting/${param.row.id}`}
            onClick={showDeleteConfirmOverlay}
            className="bg-gray-200 text-black py-3 px-5 rounded"
          >
            View more details
          </Link>
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

export default CreditUnionReportTable;
