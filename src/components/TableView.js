import React from "react";
import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Paper, Checkbox, IconButton, Input } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import BookWithPencilIcon from "./BookWithPencil.svg";

export default function TableView({
  data,
  currentPage,
  rowLimit,
  selected,
  selectedEdit,
  editData,
  handleEdit,
  handleEditChange,
  handleDelete,
  handleCheckboxClick,
  handleSelectAllClick,
}) {
  // Implementing pagination

  const low = (currentPage - 1) * rowLimit;
  const high = currentPage * rowLimit;

  let subData = data.slice(low, high);

  // This will be used to show inderminent on table header checkbox (The '-' icon when one or some items are selected)

  let allCurrentSelected =
    Array.isArray(subData) && subData.every((user) => selected.has(user.id));

  /**
   * given User ID is in selected or not
   * @param {number} id - User ID.
   * */

  const isSelected = (id) => {
    return selected.has(id);
  };

  const EditTableCell = (user, field) => (
    <TableCell align="center">
      {selectedEdit.has(user.id) ? (
        <Input
          value={editData[user.id][field]}
          onChange={(e) => handleEditChange(e, user.id, field)}
        />
      ) : (
        user[field]
      )}
    </TableCell>
  );

  /**
   * Get Table Row for the given user
   * @param {User} user - User Data
   * @param {number} index - User Index
   */

  const getUserRow = (user, index) => {
    const isItemSelected = isSelected(user.id);
    const labelId = `user-list-table-label-${index}`;

    return (
      <TableRow
        key={labelId}
        className="table-row-container"
        role="checkbox"
        aria-checked={isItemSelected}
        selected={isItemSelected}
        sx={{
          "&.Mui-selected, &.Mui-selected:hover": {
            backgroundColor: "secondary.main",
          },
        }}
      >
        <TableCell
          align="center"
          onClick={(e) => handleCheckboxClick(e, user.id)}
        >
          <Checkbox
            color="primary"
            checked={isItemSelected}
            sx={{
              "&.Mui-checked": {
                color: "red",
              },
            }}
            inputProps={{
              "aria-labelledby": { labelId },
            }}
          />
        </TableCell>

        {EditTableCell(user, "name")}
        {EditTableCell(user, "email")}
        <TableCell align="center">
          {selectedEdit.has(user.id) ? (
            // Render the input field when in edit mode
            <Input
              value={editData[user.id].role}
              onChange={(e) => handleEditChange(e, user.id, "role")}
            />
          ) : (
            // Render the capitalized role when not in edit mode
            user.role.charAt(0).toUpperCase() + user.role.slice(1)
          )}
        </TableCell>

        <TableCell align="center">
          <Stack direction="row" justifyContent="center" spacing={2}>
            <IconButton
              aria-label="edit book"
              size="large"
              sx={{ color: "black" }}
              label={user.id}
              onClick={() => handleEdit(user.id)}
            >
              {selectedEdit.has(user.id) ? (
                <CheckIcon fontSize="inherit" />
              ) : (
                <img
                  src={BookWithPencilIcon}
                  alt="Book with Pencil"
                  style={{ width: "24px", height: "24px" }}
                />
              )}
            </IconButton>

            <IconButton
              aria-label="delete"
              size="large"
              sx={{ color: "red" }}
              onClick={() => handleDelete(user.id)}
            >
              <DeleteOutlineIcon fontSize="inherit" />
            </IconButton>
          </Stack>
        </TableCell>
      </TableRow>
    );
  };

  /**
   * Table of our User List View
   */

  const TableHeader = ({
    selected,
    allCurrentSelected,
    handleSelectAllClick,
  }) => (
    <TableHead>
      <TableRow>
        <TableCell align="center">
          <Checkbox
            color="primary"
            indeterminate={selected.size > 0 && !allCurrentSelected}
            checked={selected.size > 0 && allCurrentSelected}
            onClick={handleSelectAllClick}
            sx={{
              "&.Mui-checked": {
                color: "red",
              },
            }}
            inputProps={{
              "aria-labelledby": "header",
            }}
          />
        </TableCell>

        <TableCell align="center">
          <strong>Name</strong>
        </TableCell>
        <TableCell align="center">
          <strong>Email</strong>
        </TableCell>
        <TableCell align="center">
          <strong>Role</strong>
        </TableCell>
        <TableCell align="center">
          <strong>Actions</strong>
        </TableCell>
      </TableRow>
    </TableHead>
  );

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHeader
          selected={selected}
          allCurrentSelected={allCurrentSelected}
          handleSelectAllClick={handleSelectAllClick}
        />

        {Array.isArray(subData) ? (
          <TableBody>
            {subData.map((d, index) => getUserRow(d, index))}
          </TableBody>
        ) : (
          <TableBody>
            <TableRow>
              <TableCell colSpan={5}>No data available</TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
    </TableContainer>
  );
}
