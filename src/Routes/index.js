import React, { useEffect, useId, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { PUBLIC } from "./Public";
import { PROTECTED } from "./Protected";
import { PRIVATE } from "./Private";

// list of PUBLIC ROUTES
const publicRouteList = [
  { path: "/", element: PUBLIC.Login },
  { path: "/forget-password", element: PUBLIC.ForgetPWD },
  { path: "/*", element: PUBLIC.Error404 }, //If this is uncomment redirect will not work for protected & private route but Error404 page will be served ** If commented redirect will work but users won't have access to Error404 page
];

// List of PROTECTED ROUTES
const protectedRouteList = [
  { path: "/login", element: PROTECTED.Login },
  // { path: "/*", element: PRIVATE.Gateway },
  // { path: "/gateway", element: PROTECTED.Gateway },
  // { path: "/*", element: PUBLIC.Error404 }, //If this is uncomment redirect will not work for protected & private route but Error404 page will be served ** If commented redirect will work but users won't have access to Error404 page
];

// List of PRIVATE ROUTES
let privateRouteList = [];
// If role === ADMIN
if (
  JSON.parse(sessionStorage.getItem("selectedScope"))?.accessType ===
  "CREDIT_UNION_ADMINISTRATOR"
) {
  privateRouteList = [
    { path: "/login", element: PROTECTED.Login },
    {
      path: "/credit-union-admin/members",
      element: PRIVATE.CreditUnionAdminMember,
    },
    {
      path: "/credit-union-admin/reporting/transactions",
      element: PRIVATE.CreditUnionAdminTransactionRept,
    },{
      path: "/credit-union-admin/reporting/members",
      element: PRIVATE.CreditUnionAdminMembershipRept,
    },
    {
      path: "/credit-union-admin/deposit",
      element: PRIVATE.CreditUnionAdminDeposit,
    },
    {
      path: "/credit-union-admin/cashout",
      element: PRIVATE.CreditUnionAdminCashout,
    },
    {
      path: "/credit-union-admin/roles",
      element: PRIVATE.CreditUnionAdminRoles,
    },
    {
      path: "/credit-union-admin/transactions",
      element: PRIVATE.CreditUnionAdminTransaction,
    },
    {
      path: "/credit-union-admin/salary",
      // element: PRIVATE.CreditUnionAdminSalary,
    },
    {
      path: "/credit-union-admin/salary/employee/:id",
      element: PRIVATE.CreditUnionAdminEmployee,
    },
    {
      path: "/credit-union-admin/reporting",
      element: PRIVATE.CreditUnionAdminReporting,
    },
    { path: "/gateway", element: PRIVATE.Gateway },

    { path: "/*", element: PRIVATE.Gateway },
  ];
}
// If role === BRANCH OFFICER
else if (
  JSON.parse(sessionStorage.getItem("selectedScope"))?.accessType ===
  "CREDIT_UNION_BRANCH_OFFICER"
) {
  privateRouteList = [
    { path: "/login", element: PROTECTED.Login },
    // **************************************
    { path: "/gateway", element: PRIVATE.Gateway },
    { path: "/branch-officer/", element: PRIVATE.BranchOfficerMember },
    { path: "/branch-officer/deposit", element: PRIVATE.BranchOfficerDeposit },
    { path: "/branch-officer/cashout", element: PRIVATE.BranchOfficerCashout },
    { path: "/branch-officer/utility", element: PRIVATE.BranchOfficerUtility },
    {
      path: "/branch-officer/transaction",
      element: PRIVATE.BranchOfficerTransaction,
    },{
      path: "/branch-officer/report",
      element: PRIVATE.BranchOfficerReport,
    },
    { path: "/branch-officer/members", element: PRIVATE.BranchOfficerMember },
    { path: "/*", element: PRIVATE.Gateway },
    // { path: "/*", element: PUBLIC.Error404 },
  ];
}
// if role === SUPER ADMIN
else if (
  JSON.parse(sessionStorage.getItem("selectedScope"))?.accessType ===
  "SUPER_ADMINISTRATOR"
) {
  privateRouteList = [
    { path: "/login", element: PROTECTED.Login },
    {
      path: "/super-admin",
      element: PRIVATE.CreditUnionSuperAdminOrganisation,
    },
    {
      path: "/super-admin/reporting",
      element: PRIVATE.CreditUnionSuperAdminReporting,
    },
    {
      path: "/super-admin/reporting/:id",
      element: PRIVATE.CreditUnionSuperAdminReport,
    },
    {
      path: "/super-admin/reporting/:id/transactions",
      element: PRIVATE.SuperAdminTransactionReport,
    },{
      path: "/super-admin/reporting/:id/members",
      element: PRIVATE.SuperAdminMemberReport,
    },
    // **************************************
    { path: "/gateway", element: PRIVATE.Gateway },
  ];
}
// if role === NOT DEFINED
else {
  privateRouteList = [
    { path: "/login", element: PROTECTED.Login },
    { path: "/gateway", element: PRIVATE.Gateway },
    {
      path: "/credit-union-admin/members",
      element: PRIVATE.CreditUnionAdminMember,
    },
    { path: "/branch-officer/members", element: PRIVATE.BranchOfficerMember },
    {
      path: "/super-admin",
      element: PRIVATE.CreditUnionSuperAdminOrganisation,
    },
  ];
}

const RouterFilter = () => {
  const id = useId();
  const location = useLocation();
  const navigateTo = useNavigate();
  const [isLoggedIN, setIsLoggedIN] = useState(false);

  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";

    let authData = sessionStorage.getItem("authData");
    // if only authData exist grant access to protected route
    // if authData and authToken exist grant access to protected route
    // I'm only checking for the authData here but to render any private component/page, I will check if authToken exixst in session.
    if (authData) {
      setIsLoggedIN(true);
    } else {
      setIsLoggedIN(false);
      // navigateTo("/login");
    }
  }, [location.pathname, navigateTo]);

  return (
    <Routes>
      {/* Public Routes in the application */}
      {publicRouteList.map((publicRoute) => (
        <Route
          key={id}
          path={publicRoute.path}
          element={<publicRoute.element />}
        />
      ))}
      {/* Protected Routes in the application */}
      {!isLoggedIN
        ? protectedRouteList.map((protectedRoute) => (
            <>
              <Route
                key={id}
                path={protectedRoute.path}
                element={<protectedRoute.element />}
              />
            </>
          ))
        : privateRouteList.map((privateRoute) => (
            <Route
              key={id}
              path={privateRoute.path}
              element={<privateRoute.element />}
            />
          ))}
    </Routes>
  );
};

export default RouterFilter;
