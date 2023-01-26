import RightSidebar from "../../Layouts/RightSidebar/RightSidebar";
import React, { useState, useEffect } from "react";
import BranchOfficerSidebar from "../../Layouts/Sidebar/Sidebar";
import OverviewCard from "../../Components/Card/OverviewCard";
import { SVGS } from "../../Assets";
import { DataTable } from "../../Components/Table/Table";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@mui/material";
import DepositOverlay from "../../Layouts/Overlay/DepositOverlay";
import { DepositService } from "../../Services/Deposit/DepositService";
import { FetchTransactions } from "../../Services/Transactions/TransactionService";
import {Formatter} from "../../Utils/Formatter";
import Navbar from "../../Layouts/Navbar/Navbar";
// import { RefreshToken } from "../../Services/Auth/Refresh";
// import UserCard from "../../Components/Card/UserCard";

const styles = {
  registerBtn: {
    backgroundColor: "#0F5499",
    color: "#FFFFFF",
    padding: "12px 20px",
    fontWeight: "400",
    textTransform: "capitalize",
  },
};
function Deposit() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [stats, setStats] = useState({
    transaction: 0,
    deposit: 0,
  });

  const [rowData, setRowData] = useState([]);
  const [data, setData] = useState({
    mobileNumber: "2209234567",
    amount: "1",
    message: "Deposit into the account",
  });

  const [isLeftSidebarVisible, setIsLeftSidebarVisible] = useState(false);
  const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(false);

  const overviewCardLists = [
    {
      text: "Total number of transactions",
      value: stats.transaction,
      icon: <SVGS.TransactionIcon />,
    },
    {
      text: "Total amount Deposited in GMD",
      value: stats.deposit,
      icon: <SVGS.DepositIcon />,
    },
    // { text: "Cashout", value: "$ 52,394", icon: <SVGS.CashoutIcon /> },
    // { text: "Membership", value: "6520", icon: <SVGS.MembershipIcon /> },
  ];

  useEffect(() => {
    if (window.innerWidth > 540) {
      setIsLeftSidebarVisible(true);
      setIsRightSidebarVisible(true)
    } else if (window.innerWidth > 540) {
      setIsLeftSidebarVisible(false);
      setIsRightSidebarVisible(false)
    }
    
    const identityNumber = JSON.parse(sessionStorage.getItem("mobileNumber"));
    const payload = {
      receiverIdentity: {
        identity: identityNumber,
        identityType: "MSISDN",
      },
      sendingIdentity: {
        identity: identityNumber,
        identityType: "MSISDN",
      },
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
        let filteredDepositAndFee = [];
        // const filteredDeposit = 
        responseBody?.contents.forEach(
          (content) => {
            if(content.financialTransactionType === "DEPOSIT"){
              filteredDepositAndFee.push(content);
              for (let transactionIndex = 0; transactionIndex < responseBody?.contents.length; transactionIndex++) {
                if(responseBody?.contents[transactionIndex].completionDateTime === content.completionDateTime){
                  filteredDepositAndFee.push(responseBody?.contents[transactionIndex]);
                  break;
                }
              }
            }
          }
        );
        const rows = filteredDepositAndFee.map(
          ({
            id,
            amount,
            financialTransactionType,
            financialTransactionStatus,
            creationDateTime,
            completionDateTime,
            receivingAccountHolder,
            receivingIdentity
          }) => ({
            id: id,
            amount: amount?.amount,
            beneficiary: `${receivingAccountHolder?.firstName} ${receivingAccountHolder?.lastName}`,
            mobileNumber: receivingIdentity?.identity,
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
        setStats({ transaction: _count, deposit: Formatter(_totalDeposit) });
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

  const depositHandler = () => {
    const payload = {
      identity: {
        identity: data.mobileNumber,
        identityType: "MSISDN",
      },
      amount: {
        amount: parseInt(data.amount),
        currencyCode: "GMD",
      },
      message: data.message,
    };

    const promise = DepositService(payload);
    promise
      .then((response) => {
        const { responseDescription } = response.data;
        toast.promise(promise, {
          loading: "Deposit processing...",
          success: responseDescription,
          error: "Failed",
        });

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      })
      .catch((error) => {
        if (error) {
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
        }
      });

    // setTimeout(() => {
    //   setShowOverlay(false);
    // }, 1500);
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
      field: "beneficiary",
      headerName: "Beneficiary",
      minWidth: 180,
      flex: 1,
      renderCell: (param) => {
        return (
          <p className="text-center flex justify-center pl-4">{param.row.beneficiary}</p>
        );
      },
    },
    {
      field: "mobileNumber",
      headerName: "Mobile Number",
      minWidth: 180,
      flex: 1,
      renderCell: (param) => {
        return (
          <p className="text-center flex justify-center pl-4">{param.row.mobileNumber}</p>
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
    emptyDataText: "No Transaction data is available",
  };
  return (
    <div className="flex relative">
      <Toaster position="top-center" />
      {showOverlay && (
        <DepositOverlay
          data={data}
          setData={setData}
          setShowOverlay={setShowOverlay}
          depositHandler={depositHandler}
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
        <div className="middle-content w-full sm:w-[calc(100%_-_240px)] p-6 pt-16">
          <div className="pt-5">
            <h4 className="text-2xl font-semibold">Deposit</h4>
          </div>
          <div className="grid grid-cols-2 xl:grid-cols-4 mt-4 gap-4">
            {overviewCardLists.map(({ text, value, icon }, index) => (
              <OverviewCard key={index} text={text} value={value} icon={icon} />
            ))}
          </div>
          <div className="transactions py-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center my-4">
              <h4 className="text-lg font-semibold">Deposit</h4>
              <Button
                onClick={() => setShowOverlay(true)}
                style={styles.registerBtn}
              >
                Deposit to Member Account
              </Button>
            </div>
            <div className="overflow-y-scroll_ h-[350px]">
              <DataTable tableProps={tableProps} />
            </div>
            {/* {membershipList.map(({ name, role }, index) => (
              <UserCard name={name} role={role} key={index} />
            ))} */}
          </div>
        </div>
        <RightSidebar isRightSidebarVisible={isRightSidebarVisible}/>
      </div>
    </div>
  );
}

export default Deposit;
