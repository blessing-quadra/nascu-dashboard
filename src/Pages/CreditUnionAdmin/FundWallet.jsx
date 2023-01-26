import RightSidebar from "../../Layouts/RightSidebar/RightSidebar";
import React, { useEffect, useState } from "react";
import BranchOfficerSidebar from "../../Layouts/Sidebar/Sidebar";
import toast, { Toaster } from "react-hot-toast";
import { Alert, Button } from "@mui/material";
import { RefreshToken } from "../../Services/Auth/Refresh";
import FundAdminWalletOverlay from "../../Layouts/Overlay/FundAdminWalletOverlay";
import { AdminCashoutService } from "../../Services/Cashout/CashoutService";
import Navbar from "../../Layouts/Navbar/Navbar";
import { FetchTransactions } from "../../Services/Transactions/TransactionService";
import { DataTable } from "../../Components/Table/Table";
import { SVGS } from "../../Assets";
import {NumberFormatter} from "../../Utils/Formatter";
// import UserCard from "../../Components/Card/UserCard";

const styles = {
  registerBtn: {
    backgroundColor: "#0F5499",
    color: "#FFFFFF",
    padding: "12px 20px",
    fontWeight: "400",
    textTransform: "capitalize",
  },
  registerBtn2: {
    backgroundColor: "#000000",
    color: "#FFFFFF",
    padding: "12px 20px",
    fontWeight: "400",
    textTransform: "capitalize",
  },
};
function FundWallet() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [rowData, setRowData] = useState([]);

  const [isLeftSidebarVisible, setIsLeftSidebarVisible] = useState(false);
  const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(false);

  const [data, setData] = useState({
    walletId: "",
    amount: "100",
    message: "Fund admin wallet",
  });

  useEffect(() => {
    if (window.innerWidth > 540) {
      setIsLeftSidebarVisible(true);
      setIsRightSidebarVisible(true);
    } else if (window.innerWidth > 540) {
      setIsLeftSidebarVisible(false);
      setIsRightSidebarVisible(false);
    }

    // Fetch list of adjustment
    const selectedScope = JSON.parse(sessionStorage.getItem("selectedScope"));
    const organizationId = selectedScope?.organizationId;

    const payload = {
      financialTransactionType: "ADJUSTMENT",
      // sendingOrganizationId: organizationId,
      receivingOrganizationId: organizationId,
      page: "1",
      size: "50",
    };

    const promise = FetchTransactions(payload);
    promise
      .then((response) => {
        const { responseDescription, responseBody } = response.data;
        toast.promise(promise, {
          loading: "Deposit processing...",
          success: responseDescription,
          error: "Failed",
        });
        const filteredDeposit = responseBody?.contents.filter(
          (content) => content.financialTransactionType === "ADJUSTMENT"
        );
        const rows = filteredDeposit.map(
          ({
            id,
            amount,
            financialTransactionType,
            financialTransactionStatus,
            creationDateTime,
            completionDateTime,
            financialTransactionReference,
          }) => ({
            id: financialTransactionReference
              ? financialTransactionReference
              : id,
            amount: amount?.amount,
            transactionType: financialTransactionType,
            transactionStatus: financialTransactionStatus,
            createdAt: creationDateTime,
            completionDate: completionDateTime,
          })
        );
        // let _totalDeposit = 0;
        // let _count = 0;
        // rows.forEach((elem) => {
        //   _totalDeposit = _totalDeposit + elem.amount;
        //   _count = _count + 1;
        // });
        // setStats({ transaction: _count, deposit: Formatter(_totalDeposit) });
        // alert(JSON.stringify(rows))
        setRowData(rows);

        // alert(JSON.stringify(rows));
      })
      .catch((error) => {
        const { status, responseBody } = error?.response?.data;

        if (status === 400) {
          toast.error("Bad request. Check and retry.");
        } else if (status === 404) {
          toast.error("Resources not available.");
        } else if (status === 500) {
          toast.error(responseBody.errorDescription);
        } else {
          toast.error(responseBody.errorDescription);
        }
      });
  }, []);

  const fundAdminWallet = () => {
    const payload = {
      amount: {
        amount: parseInt(data.amount),
        currencyCode: "GMD",
      },
      walletId: data.walletId,
      note: data.message,
    };

    const promise = AdminCashoutService(payload);
    promise
      .then((response) => {
        const { responseDescription } = response.data;
        toast.promise(promise, {
          loading: "Cashout processing...",
          success: responseDescription,
          error: "Failed",
        });
        // setShowOverlay2(false);
        setTimeout(() => {
          // setDepositInfo({
          //   reference: responseBody?.reference,
          //   transactionId: responseBody?.transactionId,
          //   message: responseDescription,
          // });
          // setShowOverlay(2);
          window.location.reload();
        }, 1500);
      })
      .catch((error) => {
        const { status, responseBody } = error?.response?.data;

        if (status === 400) {
          toast.error("Bad request. Check and retry.");
        } else if (status === 404) {
          toast.error("Resources not available.");
        } else if (status === 500) {
          toast.error(responseBody.errorDescription);
        } else if (status === "EXPIRED_ACCESS") {
          toast.error(responseBody.errorDescription);
          RefreshToken();
        } else {
          toast.error(responseBody.errorDescription);
        }
      });
  };

  const rows = rowData;
  const columns = [
    {
      field: "id",
      headerName: "Transaction ID",
      width: 205,
      renderCell: (props) => {
        const CopyOrgIDHandler = (id) => {
          window.navigator.clipboard.writeText(id);
          toast.success("Copied Successfully");
        };
        return (
          <p className="flex items-center relative">
            {props.value}{" "}
            <span
              onClick={() => CopyOrgIDHandler(props.value)}
              title="Copy Transaction ID"
              className="flex w-5 absolute bg-white cursor-pointer left-44"
            >
              <SVGS.CopyIcon />
            </span>
          </p>
        );
      },
    },
    {
      field: "amount",
      headerName: "Amount (GMD)",
      minWidth: 180,
      flex: 1,
      renderCell: (param) => {
        return (
          <p className="text-center flex justify-center pl-4">{(param.value)}</p>
        );
      },
    },
    {
      field: "transactionType",
      headerName: "Transaction Type",
      minWidth: 180,
      flex: 1,
    },
    {
      field: "transactionStatus",
      headerName: "Transaction Status",
      minWidth: 180,
      flex: 1,
    },
    {
      field: "createdAt",
      headerName: "Creation Period",
      minWidth: 180,
      flex: 1,
    },
    {
      field: "completionDate",
      headerName: "Completion Period",
      minWidth: 180,
      flex: 1,
    },
  ];

  const tableProps = {
    columns,
    rows,
    icon: "",
    emptyDataText: "No adjustment data is available",
  };

  return (
    <div className="flex relative">
      <Toaster position="top-center" />
      {showOverlay && (
        <FundAdminWalletOverlay
          wallet={wallet}
          data={data}
          setData={setData}
          setShowOverlay={setShowOverlay}
          fundAdminWallet={fundAdminWallet}
        />
      )}
      <BranchOfficerSidebar
        isLeftSidebarVisible={isLeftSidebarVisible}
        setIsLeftSidebarVisible={setIsLeftSidebarVisible}
      />
      <div className="w-full sm:w-[calc(100%_-_230px)] flex items-start h-screen bg-white">
        <Navbar
          setIsLeftSidebarVisible={setIsLeftSidebarVisible}
          setIsRightSidebarVisible={setIsRightSidebarVisible}
        />
        <div className="middle-content w-full sm:w-[calc(100%_-_240px)] p-6">
          <div className="pt-16 sm:pt-5 flex items-center gap-4">
            <h4 className="text-2xl font-semibold">Fund Main Wallet</h4>
          </div>

          <div className="transactions py-4">
            <div className="flex flex-col my-4">
              <Alert severity="info">
                This section is used to fund admin main wallet.
              </Alert>
              <div className="flex mt-4 flex-col items-start justify-center gap-4">
                <Button
                  onClick={() => setShowOverlay(true)}
                  style={styles.registerBtn}
                >
                  Fund Main Wallet
                </Button>

                <div className="w-full h-[350px]">
                  <DataTable tableProps={tableProps} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <RightSidebar
          setWallet={setWallet}
          isRightSidebarVisible={isRightSidebarVisible}
        />
      </div>
    </div>
  );
}

export default FundWallet;
