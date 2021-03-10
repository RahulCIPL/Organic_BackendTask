import React from "react";
import { Link } from "react-router-dom";
import AuthOptions from "../auth/authOptions";

// Purpose: Header Page
// Created By: CIPL
function Header() {

    return (
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <Link to="/" className="navbar-brand">
          Organic CMS
        </Link>
        <AuthOptions />
      </nav>
    );
}

export default Header;
