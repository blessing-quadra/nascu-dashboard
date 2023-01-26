import RightSidebar from "../../Layouts/RightSidebar/RightSidebar";
import React, { useEffect, useState } from "react";
import BranchOfficerSidebar from "../../Layouts/Sidebar/Sidebar";
import OverviewCard from "../../Components/Card/OverviewCard";
import { SVGS } from "../../Assets";
import { DataTable } from "../../Components/Table/Table";
import { Toaster } from "react-hot-toast";
import { Button } from "@mui/material";
import RegisterUserOverlay from "../../Layouts/Overlay/RegisterUserOverlay";
import { useSelector } from "react-redux";
import MembershipInfoOverlay from "../../Layouts/Overlay/MembershipInfoOverlay";
import { FetchAllRoles } from "../../Services/Role/Role";
import Navbar from "../../Layouts/Navbar/Navbar";
import Search from "../../Components/Search/Search";
import { FetchTransactions } from "../../Services/Transactions/TransactionService";
import { id } from "date-fns/locale";
// import UserCard from "../../Components/Card/UserCard";

const styles = {
  registerBtn: {
    backgroundColor: "#0F5499",
    color: "#FFFFFF",
    padding: "12px 20px",
    fontWeight: "400",
    textTransform: "capitalize",
  },
  activateBtn: {
    backgroundColor: "#0F5499",
    color: "#FFFFFF",
    padding: "12px 20px",
    fontWeight: "400",
    fontSize: "13px",
    textTransform: "capitalize",
  },
  viewBtn: {
    border: "1px solid #0F5499",
    color: "#0F5499",
    padding: "12px 20px",
    fontWeight: "400",
    fontSize: "13px",
    textTransform: "capitalize",
  },
};
function Transaction() {
  const user = useSelector((state) => state.userReducer);
  const [showOverlay, setShowOverlay] = useState(false);
  const [organizationData, setOrganizationData] = useState(null);
  const [rolesData, setRolesData] = useState(null);
  const [transactionData, setTransactionData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [viewUserInfo, setViewUserInfo] = useState(false);
  const [userInfoSelected, setUserInfoSelected] = useState([]);
  const [showFilterOptionLists, setShowFilterOptionLists] = useState(false);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    // username: "",
    // emailAddress: "",
    mobileNumber: "",
    gender: "",
    maritalStatus: "",
    organizationId: JSON.parse(sessionStorage.getItem("selectedScope"))
      .organizationId,
    organizationMemberId: "",
    employeeId: "",
    password: "",
  });

  const [isLeftSidebarVisible, setIsLeftSidebarVisible] = useState(true);
  const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(true);
  const [selectedFilterProperties, setSelectedFilterProperties] =
    useState("transactionType");

  const filterProperties = ["transactionType", "receiverIdentity"];

  const accumulatorHandler = () => {
    let accumulator = 0;
    filteredData.forEach(({amount})=> {
      accumulator += amount;
    });
    return accumulator;
  }
  
  const overviewCardLists = [
    {
      text: "Total number of transactions",
      value: filteredData.length,
      icon: <SVGS.MembershipIcon />,
    },
    {
      text: "Total amount of transaction",
      value: accumulatorHandler(),
      icon: <SVGS.MembershipIcon />,
    }
  ];

  

  useEffect(() => {
    const organizationId = JSON.parse(
      sessionStorage.getItem("selectedScope")
    ).organizationId;

    const payload = {
      financialTransactionType: "DEPOSIT",
      sendingOrganizationId: organizationId,
      receivingOrganizationId: organizationId,
      page: "1",
      size: "50",
    };

    const promise = FetchAllRoles();
    const promise2 = FetchTransactions(payload);

    if (window.innerWidth > 540) {
      setIsLeftSidebarVisible(true);
      setIsRightSidebarVisible(true);
    } else if (window.innerWidth > 540) {
      setIsLeftSidebarVisible(false);
      setIsRightSidebarVisible(false);
    }

    const orgData = {
      label: JSON.parse(sessionStorage.getItem("selectedScope"))
        .organizationName,
      value: JSON.parse(sessionStorage.getItem("selectedScope")).organizationId,
    };
    setOrganizationData(orgData);

    promise.then((response) => {
      const { contents } = response.data.responseBody;
      const roles = [];
      contents.forEach(({ id, name }) => {
        roles.push({
          label: name,
          value: id,
        });
      });
      setRolesData(roles);
      // setTransactionData(contents);
    });

    promise2.then((response) => {
      const { contents } = response.data.responseBody;
      const filteredDeposit = contents.filter(
        (content) => content.financialTransactionType !== "SETTLEMENT"
      );

      let rows = [];
      filteredDeposit.forEach(
        ({
          id,
          amount,
          financialTransactionType,
          financialTransactionStatus,
          creationDateTime,
          receivingIdentity,
          financialTransactionReference,
        }) => {
          // Calculating statistics

          // End of calculation
          rows.push({
            id: financialTransactionReference
              ? financialTransactionReference
              : id,
            amount: amount?.amount,
            receiverIdentity: receivingIdentity
              ? receivingIdentity?.identity
              : "Not Available",
            transactionType: financialTransactionType,
            transactionStatus: financialTransactionStatus,
            createdAt: creationDateTime,
          });
        }
      );
      console.log(rows);
      setTransactionData(rows);
      setFilteredData(rows);
    });
  }, []);

  const rows = filteredData;

  const filterHandler = (e) => {
    if (e.target.value.length > 2) {
      let newFilteredData;
      switch (selectedFilterProperties) {
        case "transactionType":
          newFilteredData = transactionData.filter(
            (eachData) =>
              eachData.transactionType.toLowerCase().indexOf(e.target.value) >
              -1
          );
          break;

        case "receiverIdentity":
          newFilteredData = transactionData.filter(
            (eachData) =>
              eachData.receiverIdentity.toLowerCase().indexOf(e.target.value) >
              -1
          );
          break;

        case "mobileNumber":
          newFilteredData = transactionData.filter(
            (eachData) => eachData.mobileNumber.indexOf(e.target.value) > -1
          );
          break;

        case "employeeNumber":
          console.log(transactionData);
          newFilteredData = transactionData.filter(
            (eachData) => eachData?.employeeNumber?.indexOf(e.target.value) > -1
          );
          break;

        default:
          break;
      }

      // eachData.lastName.toLowerCase().indexOf(e.target.value) > -1 ||
      if (newFilteredData.length > 0) {
        setFilteredData(newFilteredData);
      } else {
        setFilteredData([]);
      }
    } else {
      setFilteredData(transactionData);
    }
  };

  const columns = [
    { field: "id", headerName: "Transaction ID/REF", width: 350 },
    {
      field: "amount",
      headerName: "Amount",
      width: 150,
    },
    {
      field: "transactionType",
      headerName: "Transaction Type",
      width: 220,
    },
    {
      field: "receiverIdentity",
      headerName: "Receiver Identity",
      minWidth: 150,
    },
    {
      field: "transactionStatus",
      headerName: "Transaction Status",
      minWidth: 150,
    },
    {
      field: "createdAt",
      headerName: "Created Date",
      minWidth: 220,
    },
    // {
    //   field: "",
    //   headerName: "Actions",
    //   minWidth: 160,
    //   flex: 1,
    //   renderCell: (param) => {
    //     const viewMemberHandler = () => {
    //       const data = {
    //         fullname: `${param.row.firstName} ${param.row.lastName}`,
    //         mobileNumber: param.row.mobileNumber,
    //         status: {
    //           label: param.row.accountHolderStatus,
    //           value: param.row.accountHolderStatus,
    //         },
    //       };
    //       setViewUserInfo(true);
    //       setUserInfoSelected(data);
    //     };
    //     return param.row.accountHolderStatus === "REGISTERED" ? (
    //       <Button onClick={viewMemberHandler} style={styles.activateBtn}>
    //         Activate
    //       </Button>
    //     ) : (
    //       <Button onClick={viewMemberHandler} style={styles.viewBtn}>
    //         View More
    //       </Button>
    //     );
    //   },
    // },
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
      {viewUserInfo && (
        <MembershipInfoOverlay
          data={userInfoSelected}
          setData={setUserInfoSelected}
          setShowOverlay={setViewUserInfo}
        />
      )}
      {showOverlay && (
        <RegisterUserOverlay
          data={data}
          organizationData={organizationData}
          rolesData={rolesData}
          setData={setData}
          setShowOverlay={setShowOverlay}
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
          <div className="pt-16 sm:pt-5">
            <h4 className="text-2xl font-semibold">Transaction Log</h4>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 mt-4 gap-4">
            {overviewCardLists.map(({ text, value, icon }, index) => (
              <OverviewCard key={index} text={text} value={value} icon={icon} />
            ))}
          </div>
          <div className="transactions py-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center my-4">
              <h4 className="text-lg font-semibold uppercase">
                {user.userInfo.organizationName} Transactions
              </h4>
            </div>
            <div className="flex w-full">
              <Search
                showFilterOptionLists={showFilterOptionLists}
                setShowFilterOptionLists={setShowFilterOptionLists}
                selectedFilterProperties={selectedFilterProperties}
                setSelectedFilterProperties={setSelectedFilterProperties}
                filterHandler={filterHandler}
                filterProperties={filterProperties}
              />
            </div>
            <div className="overflow-y-scroll_ h-[350px]">
              <DataTable tableProps={tableProps} />
            </div>
          </div>
        </div>
        <RightSidebar isRightSidebarVisible={isRightSidebarVisible} />
      </div>
    </div>
  );
}

export default Transaction;
