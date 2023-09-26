import React from "react";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import { Button } from "@mui/material";

const actionAreaStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginLeft: 10,
  marginRight: 40,
  marginBottom: 2,
};

export default function ActionArea({
  data,
  rowLimit,
  currentPage,
  setCurrentPage,
  handleDeleteSelected,
}) {
  const DeleteSelectedButton = ({ handleDeleteSelected }) => (
    <Button
      id="delete-selected-button"
      onClick={handleDeleteSelected}
      sx={{
        color: "white",
        paddingLeft: 2,
        paddingRight: 2,
        borderRadius: 3,
        bgcolor: "red",
        "&:hover": {
          bgcolor: "brown",
        },
      }}
    >
      DELETE SELECTED
    </Button>
  );

  /**
   * Pagination
   */

  const PaginationOperation = ({ dataLength, currentPage, rowLimit }) => (
    <Pagination
      page={currentPage}
      count={Math.ceil(dataLength / rowLimit)}
      showFirstButton
      showLastButton
      sx={{
        alignSelf: "center",
        "& .MuiPaginationItem-root": {
          background: "red",
          color: "white",
          border: "none",
          margin: "0 2px",
          "&:hover": {
            background: "brown",
          },
        },
        "& .Mui-selected": {
          background: "transparent",
          color: "red",
          border: "2px solid red",
          margin: "0 2px",
        },
      }}
      onChange={(event, page) => {
        setCurrentPage(page);
      }}
    />
  );

  return (
    <Stack style={actionAreaStyle} spacing={2} id="table-action-area">
      <PaginationOperation
        dataLength={data.length}
        currentPage={currentPage}
        rowLimit={rowLimit}
      />
      <DeleteSelectedButton handleDeleteSelected={handleDeleteSelected} />
    </Stack>
  );
}
