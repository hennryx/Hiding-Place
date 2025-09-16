import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";

import Login from "./login";

import Home from "./pages/home";
import Header from "./header";
import Footer from "../../components/footer";
import AboutUs from "../home/pages/about-us";
import NotFound from "../notFound";
import Register from "./register";

const HeroPage = () => {
  const [toggle, setToggle] = useState({
    login: false,
    register: false,
    home: true,
  });

  const handleToggle = (name, val = false) => {
    setToggle({
      login: false,
      register: false,
      home: val ? val : true,
      [name]: val,
    });
  };

  return (
    <div className="min-h-screen bg-white relative">
      <Header handleToggle={handleToggle} />
      <div className="w-full h-full">
        <Routes>
          <Route path="/" element={<Home handleToggle={handleToggle} />} />
          <Route path="/about-us" Component={AboutUs}></Route>
          <Route path="/*" Component={NotFound}></Route>
        </Routes>
      </div>
      <Login
        isOpen={toggle.login}
        handleClose={() => handleToggle("login", false)}
        handleToggle={handleToggle}
      />
      <Register
        isOpen={toggle.register}
        setIsOpen={() => handleToggle("register", false)}
        handleToggle={handleToggle}
      />
      <Footer className="bg-[#161616] shadow-md text-[var(--text-color)]" />
    </div>
  );
};

export default HeroPage;
