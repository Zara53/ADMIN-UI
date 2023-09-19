import React from "react";
import TextField from "@mui/material/TextField";

export default function SearchBox({ search, setSearch }) {
  return (
    <TextField
      id="user-list-search-bar"
      placeholder="Search by name, email or role"
      type="search"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      variant="outlined"
      fullWidth={false}
      style={{ width: "90%", marginLeft: "2rem", borderRadius: "2rem" }}
      inputProps={{
        style: { color: "red" }
      }}
    />
  );
}
