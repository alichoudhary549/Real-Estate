import React, { useState } from "react";
import "./Header.css";
import { BiMenuAltRight } from "react-icons/bi";
import { getMenuStyles } from "../../utils/common";
import useHeaderColor from "../../hooks/useHeaderColor";
import OutsideClickHandler from "react-outside-click-handler";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from '../../context/AuthContext'
import ProfileMenu from "../ProfileMenu/ProfileMenu";
import AddPropertyModal from "../AddPropertyModal/AddPropertyModal";
import useAuthCheck from "../../hooks/useAuthCheck.jsx";

const Header = () => {
  const [menuOpened, setMenuOpened] = useState(false);
  const headerColor = useHeaderColor();
  const [modalOpened, setModalOpened] = useState(false);
  const { user: authUser, logout: authLogout } = useAuth()
  const isAuthenticatedLocal = !!authUser
  const { validateLogin } = useAuthCheck();


  const handleAddPropertyClick = () => {
    if (validateLogin()) {
      setModalOpened(true);
    }
  };
  return (
    <section className="h-wrapper" style={{ background: headerColor }}>
      <div className="flexCenter innerWidth paddings h-container">
        {/* logo */}
        <Link to="/">
          <img src="./logo.png" alt="logo" width={100} />
        </Link>

        {/* menu */}
        <OutsideClickHandler
          onOutsideClick={() => {
            setMenuOpened(false);
          }}
        >
          <div
            // ref={menuRef}
            className="flexCenter h-menu"
            style={getMenuStyles(menuOpened)}
          >
            <NavLink to="/properties">Properties</NavLink>

            <NavLink to="/contact">Contact</NavLink>

            {/* add property */}
            <div onClick={handleAddPropertyClick}>Add Property</div>
            <AddPropertyModal opened={modalOpened} setOpened={setModalOpened} />
            {/* login button */}
            {!isAuthenticatedLocal ? (
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <Link to="/login"><button className="button">Login</button></Link>
                <Link to="/signup"><button className="button" style={{ background: 'transparent', color: 'var(--primary)', border: '1px solid rgba(0,0,0,0.06)' }}>Sign up</button></Link>
              </div>
            ) : (
              <ProfileMenu user={authUser} logout={authLogout} />
            )}
          </div>
        </OutsideClickHandler>

        {/* for medium and small screens */}
        <div
          className="menu-icon"
          onClick={() => setMenuOpened((prev) => !prev)}
        >
          <BiMenuAltRight size={30} />
        </div>
      </div>
    </section>
  );
};

export default Header;
