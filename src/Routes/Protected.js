import React from "react";
import LoginPage from "../Pages/Auth/Login";
import ForgetPassword from "../Pages/Auth/ForgetPassword";


const Login = () => <LoginPage />;
const ForgetPWD = () => <ForgetPassword />;

export const PROTECTED = {
  Login,
  ForgetPWD
};