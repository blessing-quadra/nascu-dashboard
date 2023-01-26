import React from "react";
import { Link } from "react-router-dom";
import { DataTable } from "../../../Components/Table/Table";


function BranchOfficerUsersTable({ data }) {
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
      headerName: "Branch Officer/Agent Name",
      minWidth: 250,
      flex: 1,
    },
    {
      field: "status",
      headerName: "Branch Officer/Agent Status",
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
    },{
      field: "date",
      headerName: "Date Created",
      minWidth: 220,
      flex: 1,
      renderCell: (param) => {
        return (
          <p className="text-center flex justify-center pl-4">{param.value}</p>
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
          <Link to={`/super-admin/reporting/branch-officer/${param.row.id}`}
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

export default BranchOfficerUsersTable;
