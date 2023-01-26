import RightSidebar from "../../Layouts/RightSidebar/RightSidebar";
import React, { useState, useEffect } from "react";
import BranchOfficerSidebar from "../../Layouts/Sidebar/Sidebar";
import OverviewCard from "../../Components/Card/OverviewCard";
import { SVGS } from "../../Assets";
import { DataTable } from "../../Components/Table/Table";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@mui/material";
import CompleteCashoutOverlay from "../../Layouts/Overlay/CompleteCashoutOverlay";
import CashoutOverlay from "../../Layouts/Overlay/CashoutOverlay";
import {
  CashoutService,
  CompleteCashoutService,
} from "../../Services/Cashout/CashoutService";
import { FetchTransactions } from "../../Services/Transactions/TransactionService";
import { RefreshToken } from "../../Services/Auth/Refresh";
import {Formatter} from "../../Utils/Formatter";
import SuccessOverlay from "../../Layouts/Overlay/SuccessOverlay";
import SelectInput from "../../Components/Select/Select";
import { FetchCashouts } from "../../Services/Deposit/DepositService";
import Navbar from "../../Layouts/Navbar/Navbar";
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
function Cashout() {
  const [showOverlay, setShowOverlay] = useState(0);
  const [showOverlay2, setShowOverlay2] = useState(false);
  const [type, setType] = useState("Initiated");
  const [stats, setStats] = useState({
    transaction: 0,
    deposit: 0,
  });
  const [depositInfo, setDepositInfo] = useState(0);

  const [isLeftSidebarVisible, setIsLeftSidebarVisible] = useState(false);
  const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(false);

  const [rowData, setRowData] = useState([]);
  const [rowData2, setRowData2] = useState([]);

  useEffect(() => {
    if (window.innerWidth > 540) {
      setIsLeftSidebarVisible(true);
      setIsRightSidebarVisible(true)
    } else if (window.innerWidth > 540) {
      setIsLeftSidebarVisible(false);
      setIsRightSidebarVisible(false)
    }
    
    if (type === "Completed") {
      const mobileNum = JSON.parse(sessionStorage.getItem("mobileNumber"));
      const payload = {
        receiverIdentity: {
          identity: mobileNum,
          identityType: "MSISDN",
        },
        sendingIdentity: {
          identity: mobileNum,
          identityType: "MSISDN",
        },
        page: "1",
        size: "50",
      };

      const promise = FetchTransactions(payload);
      promise
        .then((response) => {
          const { responseDescription, responseBody } = response.data;

          if (responseBody.errorCode === "EXPIRED_ACCESS") {
            toast.error(responseDescription);
            RefreshToken();
          } else {
            toast.promise(promise, {
              loading: "Deposit processing...",
              success: responseDescription,
              error: "Failed",
            });
            const filteredDeposit = responseBody?.contents.filter(
              (content) => content.financialTransactionType === "CASH_OUT"
            );

            const rows = filteredDeposit.map(
              ({
                id,
                amount,
                financialTransactionType,
                financialTransactionStatus,
                creationDateTime,
                completionDateTime,
              }) => ({
                id: id,
                amount: amount?.amount,
                transactionType: financialTransactionType,
                transactionStatus: financialTransactionStatus,
                createdAt: creationDateTime,
                completionDate: completionDateTime,
              })
            );
            let _totalDeposit = 0;
            let _count = 0;
            rows.forEach((elem) => {
              _totalDeposit = _totalDeposit + elem.amount;
              _count = _count + 1;
            });
            setStats({
              transaction: _count,
              deposit: Formatter(_totalDeposit),
            });
            setRowData(rows);
          }
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
          } else if (status === "EXPIRED_ACCESS") {
            toast.error(responseBody.errorDescription);
            RefreshToken();
          } else {
            toast.error(responseBody.errorDescription);
          }
        });
    } else {
      const promise = FetchCashouts();
      promise
        .then((response) => {
          const { responseBody } = response.data;

          const rows = responseBody?.contents.map(
            ({
              reference,
              amount,
              cashOutStatus,
              receivingIdentity,
              creationDateTime,
            }) => ({
              id: reference,
              amount: amount?.amount,
              transactionType: cashOutStatus,
              receiver: receivingIdentity.identity,
              createdAt: creationDateTime,
            })
          );
          setRowData2(rows);
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
    }
  }, [type]);

  const [data, setData] = useState({
    mobileNumber: "2209299968",
    amount: "1",
    message: "Withdrawing cash",
  });
  const [data2, setData2] = useState({
    reference: "12953709",
    cashOutStatus: "REDEEMED",
  });

  const overviewCardLists = [
    {
      text: "Total number of transaction",
      value: stats.transaction,
      icon: <SVGS.TransactionIcon />,
    },
    {
      text: "Total amount Cashout in GMD",
      value: stats.deposit,
      icon: <SVGS.CashoutIcon />,
    },
    // { text: "Cashout", value: "$ 52,394", icon: <SVGS.CashoutIcon /> },
    // { text: "Membership", value: "6520", icon: <SVGS.MembershipIcon /> },
  ];

  const completeCashoutHandler = () => {
    const payload = {
      reference: data2.reference,
      cashOutStatus: data2.cashOutStatus,
    };

    const promise = CompleteCashoutService(payload);
    promise
      .then((response) => {
        const { responseDescription, responseBody } = response.data;

        if (responseBody.errorCode === "EXPIRED_ACCESS") {
          toast.error(responseDescription);
          RefreshToken();
        } else {
          toast.promise(promise, {
            loading: "Cashout processing...",
            success: responseDescription,
            error: "Failed",
          });
          setShowOverlay2(false);
          setTimeout(() => {
            // window.location.reload();
          }, 1500);
        }
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

    setTimeout(() => {
      setShowOverlay2(false);
    }, 500);
  };

  const initiateCashoutHandler = () => {
    const payload = {
      amount: {
        amount: parseInt(data.amount),
        currencyCode: "GMD",
      },
      senderMessage: data.message,
      receiverIdentity: {
        identity: data.mobileNumber,
        identityType: "MSISDN",
      },
    };

    const promise = CashoutService(payload);
    promise
      .then((response) => {
        const { responseDescription, responseBody } = response.data;
        if (responseBody.errorCode === "EXPIRED_ACCESS") {
          toast.error(responseDescription);
          RefreshToken();
        } else {
          toast.promise(promise, {
            loading: "Cashout processing...",
            success: responseDescription,
            error: "Failed",
          });
          setShowOverlay2(false);
          setTimeout(() => {
            setDepositInfo({
              reference: responseBody?.reference,
              transactionId: responseBody?.transactionId,
              message: responseDescription,
            });
            setShowOverlay(2);
            // window.location.reload();
          }, 1500);
        }
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

    setTimeout(() => {
      setShowOverlay2(false);
    }, 1500);
  };

  const rows = rowData;
  const rows2 = rowData2;

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
          <p className="text-center flex justify-center pl-4">{param.value}</p>
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
      field: "receiver",
      headerName: "Receiver's number",
      minWidth: 180,
      flex: 1,
    },
    {
      field: "createdAt",
      headerName: "Creation Period",
      minWidth: 180,
      flex: 1,
    },
  ];

  const columns2 = [
    {
      field: "id",
      headerName: "Reference Number",
      width: 205,
      renderCell: (props) => {
        const CopyOrgIDHandler = (reference) => {
          window.navigator.clipboard.writeText(reference);
          toast.success("Copied Successfully");
        };
        return (
          <p className="flex items-center relative">
            {props.value}{" "}
            <span
              onClick={() => CopyOrgIDHandler(props.value)}
              title="Copy Reference Number"
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
          <p className="text-center flex justify-center pl-4">{param.value}</p>
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
      field: "receiver",
      headerName: "Receiver Number",
      minWidth: 180,
      flex: 1,
    },
    {
      field: "createdAt",
      headerName: "Creation Period",
      minWidth: 180,
      flex: 1,
    },
  ];
  const tableProps = {
    columns,
    rows,
    icon: "",
    emptyDataText: "No Cashout data is available",
  };
  const tableProps2 = {
    columns: columns2,
    rows: rows2,
    icon: "",
    emptyDataText: "No Cashout data is available",
  };
  return (
    <div className="flex relative">
      <Toaster position="top-center" />
      {showOverlay === 1 && (
        <CashoutOverlay
          data={data}
          setData={setData}
          setShowOverlay={setShowOverlay}
          initiateCashoutHandler={initiateCashoutHandler}
        />
      )}
      {showOverlay === 2 && (
        <SuccessOverlay
          data={data}
          depositInfo={depositInfo}
          setShowOverlay={setShowOverlay}
          // initiateCashoutHandler={initiateCashoutHandler}
        />
      )}
      {showOverlay2 && (
        <CompleteCashoutOverlay
          data={data2}
          setData={setData2}
          setShowOverlay={setShowOverlay2}
          completeCashoutHandler={completeCashoutHandler}
        />
      )}
      <BranchOfficerSidebar isLeftSidebarVisible={isLeftSidebarVisible}
        setIsLeftSidebarVisible={setIsLeftSidebarVisible}/>
      <div className="w-full sm:w-[calc(100%_-_230px)] flex items-start h-screen bg-white">
        <Navbar
          setIsLeftSidebarVisible={setIsLeftSidebarVisible}
          setIsRightSidebarVisible={setIsRightSidebarVisible}
        />
        <div className="middle-content w-full sm:w-[calc(100%_-_240px)] p-6">
          <div className="pt-16 flex items-center gap-4">
            <h4 className="text-2xl font-semibold">Cashout</h4>
            <div className="w-64">
              <SelectInput
                className="w-full"
                value={type}
                label={"Cashout Status"}
                options={[
                  { label: "Initiated", value: "Initiated" },
                  { label: "Completed", value: "Completed" },
                ]}
                onChange={(e) => setType(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 mt-4 gap-4">
            {overviewCardLists.map(({ text, value, icon }, index) => (
              <OverviewCard key={index} text={text} value={value} icon={icon} />
            ))}
          </div>
          <div className="transactions py-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center my-4">
              <h4 className="text-lg font-semibold">Cashout</h4>
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => setShowOverlay(1)}
                  style={styles.registerBtn2}
                >
                  Initiate Cashout
                </Button>
                <Button
                  onClick={() => setShowOverlay2(true)}
                  style={styles.registerBtn}
                >
                  Complete Cashout
                </Button>
              </div>
            </div>
            {type === "Completed" && (
              <div className="overflow-y-scroll_ h-[350px]">
                {/* {JSON.stringify(tableProps)} */}
                <DataTable tableProps={tableProps} />
              </div>
            )}
            {type === "Initiated" && (
              <div className="overflow-y-scroll_ h-[350px]">
                {/* {JSON.stringify(tableProps2)} */}
                <DataTable tableProps={tableProps2} />
              </div>
            )}

            {/* {membershipList.map(({ name, role }, index) => (
              <UserCard name={name} role={role} key={index} />
            ))} */}
          </div>
        </div>
        <RightSidebar isRightSidebarVisible={isRightSidebarVisible} />
      </div>
    </div>
  );
}

export default Cashout;
