import React from "react";
import Link from "next/link";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="header__logo">
        <Link href="/">
          <img src="/logo.png" alt="Logo" height={40} />
        </Link>
      </div>
      <nav className="header__nav">
        <Link href="/login" className="header__btn">Login</Link>
      </nav>
    </header>
  );
};

export default Header; 