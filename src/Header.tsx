
import React, { useState } from 'react';
import './Header.css';

export default function Header() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <header>
        <h1>COFFEE RUN</h1>
        <button className="menu-toggle" onClick={toggleSidebar}>
          {isSidebarOpen ? '✖' : '☰'}
        </button>
        <nav className="desktop-nav">
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#upload">Upload Your Picture</a></li>
            <li><a href="#results">Results</a></li>
          </ul>
        </nav>
      </header>
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <ul>
          <li><a href="#home" onClick={toggleSidebar}>Home</a></li>
          <li><a href="#upload" onClick={toggleSidebar}>Upload Your Picture</a></li>
          <li><a href="#results" onClick={toggleSidebar}>Results</a></li>
        </ul>
      </div>
      {isSidebarOpen && <div className="overlay" onClick={toggleSidebar} />}
    </>
  );
}
