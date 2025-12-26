import React, { useContext, useEffect } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { Outlet } from "react-router-dom";
import { useAuth } from '../../context/AuthContext'
import UserDetailContext from "../../context/UserDetailContext";
import { useMutation } from "react-query";
import { createUser } from "../../utils/api";
import useFavourites from "../../hooks/useFavourites";
import useBookings from "../../hooks/useBookings";

const Layout = () => {

  useFavourites()
  useBookings()

  const { user, token } = useAuth();
  const { setUserDetails } = useContext(UserDetailContext);

  useEffect(() => {
    // If local auth has a token, set it into UserDetailContext for other hooks
    if (token) {
      setUserDetails((prev) => ({ ...prev, token, user }));
    }
  }, [token]);

  return (
    <>
      <div style={{ background: "var(--black)", overflow: "hidden" }}>
        <Header />
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default Layout;
