import React from 'react';
import { Link } from 'react-router-dom';
import { BusIcon } from 'lucide-react';
import './Navbar.css';

const Navbar: React.FC = () => {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <BusIcon size={24} className="navbar-symbol" />
          <span className="navbar-title">BusSearch</span>
        </Link>
        <nav className="navbar-nav">
          <Link to="/">Home</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
