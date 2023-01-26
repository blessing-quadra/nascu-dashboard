import React from "react";
import Homepage from "../Pages/Home/Homepage";
import LoginPage from "../Pages/Auth/Login";
import ForgetPassword from "../Pages/Auth/ForgetPassword";
import Error404Page from "../Pages/Errors/Error404";

const Home = () => <Homepage />;
const Login = () => <LoginPage />;
const ForgetPWD = () => <ForgetPassword />;
const Error404 = () => <Error404Page />;

export const PUBLIC = {
  Home,
  Login,
  ForgetPWD,
  Error404,
};
