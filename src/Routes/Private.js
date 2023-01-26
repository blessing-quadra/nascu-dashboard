import React from "react";

// Branch officer routes
import BranchOfficerMemberPage from "../Pages/BranchOfficer/Member";
import BranchOfficerDepositPage from "../Pages/BranchOfficer/Deposit";
import BranchOfficerCashoutPage from "../Pages/BranchOfficer/Cashout.jsx";
import BranchOfficerUtilityPage from "../Pages/BranchOfficer/Utility";
import BranchOfficerTransactionPage from "../Pages/BranchOfficer/Transaction";
import BranchOfficerReportPage from "../Pages/BranchOfficer/Report";
import GatewayPage from "../Pages/Gateway/Gateway";
// Credit Union admin routes
import CreditUnionReportPage from "../Pages/CreditUnionAdmin/Report/CreditUnionReport";
import CreditUnionAdminMemberPage from "../Pages/CreditUnionAdmin/Member";
import CreditUnionAdminDepositPage from "../Pages/CreditUnionAdmin/Deposit";
import CreditUnionAdminCashoutPage from "../Pages/CreditUnionAdmin/FundWallet";
import CreditUnionAdminTransactionPage from "../Pages/CreditUnionAdmin/Transaction";
import CreditUnionAdminRolesPage from "../Pages/CreditUnionAdmin/Roles";
import CreditUnionAdminSalaryPage from "../Pages/CreditUnionAdmin/Salary";
import CreditUnionAdminEmployeePage from "../Pages/CreditUnionAdmin/Employee";
import CreditUnionAdminReportingPage from "../Pages/CreditUnionAdmin/Reporting";

import CreditUnionAdminTransactionReportingPage from "../Pages/CreditUnionAdmin/Report/TransactionReport";
import CreditUnionAdminMembershipReportingPage from "../Pages/CreditUnionAdmin/Report/MembershipReport";
import CreditUnionAdminSalaryReportingPage from "../Pages/CreditUnionAdmin/Report/SalaryReport";
// import CreditUnionAdminCommissionReportingPage from "../Pages/CreditUnionAdmin/Report/TransactionReport";
// Credit Union super admin routes
import SuperAdminTransactionReportPage from "../Pages/SuperAdmin/Report/TransactionReport";
import SuperAdminMemberReportPage from "../Pages/SuperAdmin/Report/MembershipReport";
import CreditUnionSuperAdminReportPage from "../Pages/SuperAdmin/Report/CreditUnionReport";
import CreditUnionSuperAdminOrganisationPage from "../Pages/SuperAdmin/Organisations";
import CreditUnionSuperAdminReportingPage from "../Pages/SuperAdmin/Reporting";

const Gateway = () => <GatewayPage />;

// Branch officer routes
const BranchOfficerMember = () => <BranchOfficerMemberPage />;
const BranchOfficerDeposit = () => <BranchOfficerDepositPage />;
const BranchOfficerCashout = () => <BranchOfficerCashoutPage />;
const BranchOfficerUtility = () => <BranchOfficerUtilityPage />;
const BranchOfficerTransaction = () => <BranchOfficerTransactionPage />;
const BranchOfficerReport = () => <BranchOfficerReportPage />;
// Credit Union admin routes
const CreditUnionReport = () => <CreditUnionReportPage />;
const CreditUnionAdminMember = () => <CreditUnionAdminMemberPage />;
const CreditUnionAdminDeposit = () => <CreditUnionAdminDepositPage />;
const CreditUnionAdminCashout = () => <CreditUnionAdminCashoutPage />;
const CreditUnionAdminTransaction = () => <CreditUnionAdminTransactionPage />;
const CreditUnionAdminRoles = () => <CreditUnionAdminRolesPage />;
const CreditUnionAdminSalary = () => <CreditUnionAdminSalaryPage />;
const CreditUnionAdminEmployee = () => <CreditUnionAdminEmployeePage />;
const CreditUnionAdminReporting = () => <CreditUnionAdminReportingPage />;
const CreditUnionAdminTransactionRept = () => (
  <CreditUnionAdminTransactionReportingPage />
);
const CreditUnionAdminMembershipRept = () => (
  <CreditUnionAdminMembershipReportingPage />
);
const CreditUnionAdminSalaryRept = () => (
  <CreditUnionAdminSalaryReportingPage />
);
// Credit Union superadmin routes
const CreditUnionSuperAdminOrganisation = () => (
  <CreditUnionSuperAdminOrganisationPage />
);
const CreditUnionSuperAdminReport = () => <CreditUnionSuperAdminReportPage />;

const SuperAdminTransactionReport = () => <SuperAdminTransactionReportPage />;
const SuperAdminMemberReport = () => <SuperAdminMemberReportPage />;
const CreditUnionSuperAdminReporting = () => (
  <CreditUnionSuperAdminReportingPage />
);

export const PRIVATE = {
  Gateway,
  // Branch officer routes
  BranchOfficerMember,
  BranchOfficerDeposit,
  BranchOfficerCashout,
  BranchOfficerUtility,
  BranchOfficerTransaction,
  BranchOfficerReport,
  // Credit union admin routes
  CreditUnionReport,
  CreditUnionAdminMember,
  CreditUnionAdminDeposit,
  CreditUnionAdminCashout,
  CreditUnionAdminTransaction,
  CreditUnionAdminRoles,
  CreditUnionAdminSalary,
  CreditUnionAdminEmployee,
  CreditUnionAdminReporting,
  CreditUnionAdminTransactionRept,
  CreditUnionAdminMembershipRept,
  CreditUnionAdminSalaryRept,
  // Credit union super admin routes
  SuperAdminTransactionReport,
  SuperAdminMemberReport,
  CreditUnionSuperAdminReport,
  CreditUnionSuperAdminOrganisation,
  CreditUnionSuperAdminReporting,
};
