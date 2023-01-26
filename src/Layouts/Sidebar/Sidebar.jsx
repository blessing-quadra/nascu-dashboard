// FOR SOME WEIRD REASONS REACT-ROUTER-DOM NAVIGATE NEEDS WINDOW.LOCATION.RELOAD BEFORE IT WORKs

import { Button } from "@mui/material";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { IMAGES, SVGS } from "../../Assets";
import toast from "react-hot-toast";
import { FetchRoles } from "../../Services/Role/Role";
import { RefreshToken } from "../../Services/Auth/Refresh";

const sideMenusForSuperAdmin = [
  // { text: "Dashboard", icon: <SVGS.HomeIcon />, link: "/branch-officer/" },
  {
    text: "Organisation Management",
    icon: <SVGS.MembershipIcon />,
    link: "/super-admin",
  },
  {
    text: "Reporting",
    icon: <SVGS.UtilityIcon />,
    link: "/super-admin/reporting",
  },
];

const sideMenusForCUAdmin = [
  // { text: "Dashboard", icon: <SVGS.HomeIcon />, link: "/branch-officer/" },
  {
    text: "Membership",
    icon: <SVGS.MembershipIcon />,
    link: "/credit-union-admin/members",
  },
  {
    text: "Deposit",
    icon: <SVGS.DepositIcon />,
    link: "/credit-union-admin/deposit",
  },
  {
    text: "Fund Main Wallet",
    icon: <SVGS.CashoutIcon />,
    link: "/credit-union-admin/cashout",
  },
  {
    text: "Transaction",
    icon: <SVGS.TransactionIcon />,
    link: "/credit-union-admin/transactions",
  },
  {
    text: "Roles Management",
    icon: <SVGS.HomeIcon />,
    link: "/credit-union-admin/roles",
  },
  {
    text: "Members Salary",
    icon: <SVGS.TransactionIcon />,
    link: "/credit-union-admin/salary",
  },
  {
    text: "Reporting",
    icon: <SVGS.UtilityIcon />,
    link: "/credit-union-admin/reporting",
  },
];

function BranchOfficerSidebar({
  isLeftSidebarVisible,
  setIsLeftSidebarVisible,
}) {
  const navigate = useNavigate();
  const [accessType, setAccessType] = useState(null);
  const [setPermissions] = useState([]);
  useEffect(() => {
    const acctType = JSON.parse(
      sessionStorage.getItem("selectedScope")
    )?.accessType;
    setAccessType(acctType);

    const roleId = JSON.parse(sessionStorage.getItem("selectedScope"))?.roleId;
    const promise = FetchRoles(roleId);
    // toast.promise(promise, {
    //   loading: "Fetching wallet details",
    // });
    if (roleId) {
      promise
        .then((response) => {
          const { responseBody } = response?.data;
          setPermissions(responseBody?.permissions);
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
            } else if (status === "EXPIRED_ACCESS") {
              toast.error(responseBody.errorDescription);
              const promise = RefreshToken();
              promise.then((resp) => {
                const { accessToken, refreshToken } = resp.data.responseBody;
                sessionStorage.setItem("token", JSON.stringify(accessToken));
                sessionStorage.setItem(
                  "refreshToken",
                  JSON.stringify(refreshToken)
                );
                window.location.reload();
              });
            } else {
              toast.error(responseBody.errorDescription);
            }
          }
        });
    } else {
      sessionStorage.clear();
      navigate("/login");
      window.location.reload();
    }
  }, [setPermissions, navigate]);

  const logoutHandler = () => {
    toast.success("Account logout Successful");
    const rolesLength = JSON.parse(window.sessionStorage.getItem("authData"))
      .scopes.length;
    if (rolesLength === 1) {
      sessionStorage.clear();
      navigate("/login");
    } else {
      window.sessionStorage.removeItem("selectedScope");
      window.sessionStorage.removeItem("refreshToken");
      window.sessionStorage.removeItem("token");
      navigate("/gateway");
    }
    window.location.reload();
  };

  const sideMenusForBranchOfficer = [
    // { text: "Dashboard", icon: <SVGS.HomeIcon />, link: "/branch-officer/" },
    {
      text: "Membership",
      icon: <SVGS.MembershipIcon />,
      link: "/branch-officer/members",
    },
    {
      text: "Deposit",
      icon: <SVGS.DepositIcon />,
      link: "/branch-officer/deposit",
    },
    {
      text: "Cashout",
      icon: <SVGS.CashoutIcon />,
      link: "/branch-officer/cashout",
    },
    {
      text: "Utilities",
      icon: <SVGS.UtilityIcon />,
      link: "/branch-officer/utility",
    },
    {
      text: "Transactions",
      icon: <SVGS.TransactionIcon />,
      link: "/branch-officer/transaction", //link: "/branch-officer/transaction",
    }, {
      text: "Report",
      icon: <SVGS.UtilityIcon />,
      link: "/branch-officer/report",
    },
  ];

  const isCreditUnionAdmin =
    JSON.parse(sessionStorage.getItem("selectedScope"))?.accessType ===
    "CREDIT_UNION_ADMINISTRATOR";

  return (
    <>
      {isLeftSidebarVisible && (
        <div
          className={
            isCreditUnionAdmin
              ? "w-[230px] fixed sm:sticky top-0 bg-black h-screen overflow-hidden z-20 sm:block"
              : "w-[230px] fixed sm:sticky top-0 bg-primary-theme h-screen overflow-hidden z-20 sm:block"
          }
        >
          <nav className="flex flex-row justify-between items-center gap-4 w-full px-4 pt-4 pb-10">
            <img src={IMAGES.Logo} alt="logo" width={"150"} />
            <span
              onClick={() => setIsLeftSidebarVisible(false)}
              className="block sm:hidden"
            >
              <Button>
                <SVGS.CloseIcon />
              </Button>
            </span>
          </nav>
          <div className="w-full flex flex-col gap-1 h-full bg-blue-50 shadow">
            {/* Sidebar for branch officers */}
            {accessType === "CREDIT_UNION_BRANCH_OFFICER" &&
              sideMenusForBranchOfficer.map(({ text, icon, link }, index) => (
                <NavLink
                  key={index}
                  to={link}
                  className={(navData) =>
                    navData.isActive
                      ? "flex items-center px-4 bg-white py-4 gap-2"
                      : "flex items-center px-4 hover:bg-white py-4 gap-2"
                  }
                >
                  {icon}
                  {text}
                </NavLink>
              ))}
            {/* End of sidebar for branch officer */}
            {/* Sidebar for credit union admin */}
            {accessType === "CREDIT_UNION_ADMINISTRATOR" &&
              sideMenusForCUAdmin.map(({ text, icon, link }, index) => (
                <NavLink
                  key={index}
                  to={link}
                  className={(navData) =>
                    navData.isActive
                      ? "flex items-center px-4 bg-white py-4 gap-2"
                      : "flex items-center px-4 hover:bg-white py-4 gap-2"
                  }
                >
                  {icon}
                  {text}
                </NavLink>
              ))}
            {/* End of sidear for credit union admin */}
            {/* Sidebar for super admin */}
            {accessType === "SUPER_ADMINISTRATOR" &&
              sideMenusForSuperAdmin.map(({ text, icon, link }, index) => (
                <NavLink
                  key={index}
                  to={link}
                  className={(navData) =>
                    navData.isActive
                      ? "flex items-center px-4 bg-white py-4 gap-2"
                      : "flex items-center px-4 hover:bg-white py-4 gap-2"
                  }
                >
                  {icon}
                  {text}
                </NavLink>
              ))}
            {/* End of sidebar or super admin */}

            <Link
              onClick={logoutHandler}
              to="#logout"
              className="flex items-center px-4 hover:bg-white py-4 gap-2"
            >
              <SVGS.LogoutIcon />
              Logout
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export default BranchOfficerSidebar;
