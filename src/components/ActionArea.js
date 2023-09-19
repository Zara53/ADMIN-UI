import React from "react";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import { Button } from "@mui/material";

/**
 * This page has DeleteButton, Pagination
 */

export default function ActionArea({
  data,
  rowLimit,
  currentPage,
  setCurrentPage,
  handleDeleteSelected
}) {
  const DeleteSelectedButton = ({ handleDeleteSelected }) => (
    <Button
      id="delete-selected-button"
      onClick={handleDeleteSelected}
      sx={{
        color: "common.white",
        paddingLeft: 2,
        paddingRight: 2,
        borderRadius: 3,
        bgcolor: "red",
        "&:hover": {
          bgcolor: "cyan"
        }
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
      // color="primary"
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
            background: "cyan"
          }
        },
        "& .Mui-selected": {
          background: "transparent",
          color: "red",
          border: "2px solid red",
          margin: "0 2px"
        }
      }}
      onChange={(event, page) => {
        setCurrentPage(page);
      }}
    />
  );

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
      id="table-action-area"
      sx={{ marginLeft: 10, marginRight: 40, marginBottom: 2 }}
    >
      <DeleteSelectedButton handleDeleteSelected={handleDeleteSelected} />

      <PaginationOperation
        dataLength={data.length}
        currentPage={currentPage}
        rowLimit={rowLimit}
      />
    </Stack>
  );
}
