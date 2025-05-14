import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import SignUpPage from "./Pages/SignUpPage";
import LoginPage from "./Pages/LoginPage";

const App = () => {
  const authUser = null;
  return (
    <div className="flex flex-col items-center justify-start">
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to={"/"} />}
        />
      </Routes>
    </div>
  );
};

export default App;
