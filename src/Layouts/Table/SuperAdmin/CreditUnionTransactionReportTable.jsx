import React from "react";
import { Link } from "react-router-dom";
import { DataTable } from "../../../Components/Table/Table";

function CreditUnionTransactionReportTable({ data }) {
  console.log(data)
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 80,
      hide: true,
    },
    {
      field: "amount",
      headerName: "Amount(GMD)",
      minWidth: 180,
      flex: 1,
      renderCell: (param) => {
        return (
          <p className="text-center flex justify-center pl-4">${param.value.toLocaleString()}</p>
        );
      },
    },
    {
      field: "transaction_type",
      headerName: "Transaction Type",
      minWidth: 250,
      flex: 1,
    },
    {
      field: "date",
      headerName: "Transaction Date",
      minWidth: 220,
      flex: 1,
      renderCell: (param) => {
        return (
          <p className="text-center flex justify-center pl-4">{param.value}</p>
        );
      },
    },
    // {
    //   field: "action",
    //   headerName: "Action",
    //   minWidth: 180,
    //   flex: 1,
    //   renderCell: (param) => {
    //     const showDeleteConfirmOverlay = () => {
    //       setShowOverlay(3);
    //       setEmployeeIdToRemove(param.row.id);
    //     };
    //     return (
    //       <Link
    //         to={`/super-admin/reporting/${param.row.id}`}
    //         onClick={showDeleteConfirmOverlay}
    //         className="bg-gray-200 text-black py-3 px-5 rounded"
    //       >
    //         View more details
    //       </Link>
    //     );
    //   },
    // },
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

export default CreditUnionTransactionReportTable;
