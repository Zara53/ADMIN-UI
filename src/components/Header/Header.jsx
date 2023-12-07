import React from "react";
import styles from "./Header.module.css";

const Header = ({ placeholder, searchQuery, handleSearch }) => {
  return (
    <div>
      <h1 className={styles.header}>Admin-UI</h1>
      <input
        className={styles.search}
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={handleSearch}
      ></input>
    </div>
  );
};

export default Header;
