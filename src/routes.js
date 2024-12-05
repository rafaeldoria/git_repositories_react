import React from "react";
import { Routes, Route } from "react-router";
import Main from "./pages/Main";
import Repository from "./pages/Repository";

const AppRoutes = () => {
  return (
    <Routes>
      <Route exact path="/" element={<Main />} />
      <Route path="/repository/:repository" element={<Repository />} />
    </Routes>
  );
}

export default AppRoutes;