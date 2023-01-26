import React from "react";
import { Link } from "react-router-dom";
import { DataTable } from "../../../Components/Table/Table";

function CreditUnionReportTable({ data }) {
  const columns = [
    {
      field: "id",
      headerName: "Credit Union ID",
      width: 200,
      hide: true,
    },
    {
      field: "organizationShortName",
      headerName: "Short Name",
      minWidth: 130,
      flex: 1,
      renderCell: (param) => {
        let shortName = "";
        const name = param.row.organizationName.split(" ");
        name.forEach((n) => (shortName += n[0]));
        return <p>{shortName}</p>;
      },
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
      field: "transaction_amount",
      headerName: "Total Transaction Amount",
      minWidth: 200,
      flex: 1,
      renderCell: (param) => {
        return (
          <p className="text-center flex justify-center pl-4">
            {param.value && `ZMW${param.value.toLocaleString()}`}
          </p>
        );
      },
    },
    {
      field: "organizationName",
      headerName: "Organization Name",
      minWidth: 350,
      flex: 1,
    },
    {
      field: "status",
      headerName: "Credit Union Status",
      minWidth: 170,
      flex: 1,
      renderCell: (param) => {
        return (
          <div
            className={`${
              param.value === "ACTIVE" ? "text-green-600" : "text-red-600"
            }`}
          >
            {param.value}
          </div>
        );
      },
    },
    {
      field: "date",
      headerName: "Date Joined",
      minWidth: 150,
      flex: 1,
      renderCell: (param) => {
        return <p className="text-center flex justify-center">{param.value}</p>;
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
            to={`/super-admin/reporting/${param.row.id}?orgName=${param.row.organizationName}`}
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
