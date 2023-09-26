import React, { useCallback } from "react";
import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import {
  Box,
  Stack,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import Header from "./Header";
import TableView from "./TableView";
import ActionsArea from "./ActionArea";
import SearchBox from "./SearchBox";
import config from "../ipConfig.json";

/**
 * @typedef User
 * @type {object}
 * @property {number} id - User ID.
 * @property {string} name - User Name.
 * @property {string} email - User Email.
 * @property {string} role - User Role.
 */

const UserList = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [users, setUsers] = useState([]);
  const [rowLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [found, setFound] = useState([]);
  const [selectedEdit, setSelectedEdit] = useState(new Set());
  const [editData, setEditData] = useState({});
  const [selected, setSelected] = useState(new Set());
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const baseUrl = `${config.endpoint}`;

    try {
      const response = await axios.get(baseUrl);

      if (!response.status === 200) setUsers([]);

      setUsers(response.data);
    } catch (e) {
      console.log(e);
      setUsers([]);
    }
  };

  /**
   * Function to perform search based on 'search' prop's state change.
   */

  const searchUser = useCallback(() => {
    /**
     * Search users in all field
     * @param {User} User
     * @return {boolean}
     */

    const filteredUsers = users.filter((user) => {
      // String.search(pattern) -> This will search if any pattern matches
      // It returns -1 -> if string not found, else 0...n for first find
      const searchPattern = new RegExp(search, "i");

      // Search all the fields
      if (user.name.search(searchPattern) !== -1) return true;
      if (user.email.search(searchPattern) !== -1) return true;
      if (user.role.search(searchPattern) !== -1) return true;

      return false;
    });

    setFound(filteredUsers);
  }, [search, users]);

  useEffect(() => {
    searchUser();
  }, [searchUser]);

  // Handle opening the delete confirmation dialog
  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  //Handle closing the delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  // Handle confirming the deletion of selected records
  const handleConfirmDelete = () => {
    if (selected.size === 0) {
      enqueueSnackbar("No user record selected for deletion.", {
        variant: "warning",
      });
    } else {
      const filteredUsers = users.filter((user) => !selected.has(user.id));
      const filteredSearchResults = found.filter(
        (user) => !selected.has(user.id)
      );

      try {
        setUsers(filteredUsers);
        setFound(filteredSearchResults);
        enqueueSnackbar(" User records has been deleted successfully!", {
          variant: "success",
        });
      } catch (e) {
        console.error(e);
      } finally {
        setSelected(new Set());
      }
      handleCloseDeleteDialog();
    }
  };

  /**
   * Loads the current record data from users with userId
   * @param {number} id User ID
   * @returns {undefined}
   */

  const loadEditData = (id) => {
    const userIndex = users.findIndex((user) => user.id === id);
    const user = users[userIndex];

    setEditData({ ...editData, [id]: { ...user } });
  };

  /**
   * Change in user data happens in-memory
   * @param {number} id userId
   * @returns {undefined}
   */

  const modifiedData = (id) => {
    const dataIndex = users.findIndex((user) => user.id === id);

    if (dataIndex === -1) return;

    try {
      const newUsers = [...users];

      newUsers[dataIndex]["name"] = editData[id].name;
      newUsers[dataIndex]["email"] = editData[id].email;
      newUsers[dataIndex]["role"] = editData[id].role;

      setUsers(newUsers);
    } catch (e) {
      console.log(e);
    } finally {
      const newSelectedEdit = new Set(selectedEdit);

      newSelectedEdit.delete(id);

      setSelectedEdit(newSelectedEdit);
    }
  };

  /**
   * Edit handle for each record in Table View
   * @param {number} id userId
   * @returns {undefined}
   */

  const editUserData = (id) => {
    if (selectedEdit.has(id)) {
      modifiedData(id);
      enqueueSnackbar(`User Record  with id=${id} has been updated!`, {
        variant: "warning",
      });
      return;
    }

    // Open edit functionality
    const newSelectedEdit = new Set(selectedEdit);
    newSelectedEdit.add(id);
    setSelectedEdit(newSelectedEdit);

    loadEditData(id);
  };

  /**
   * Handle changes of records which are open in edit mode
   * @param {object} e
   * @param {number} id userID
   * @param {string} key field of User record to be updated
   * @returns {undefined}
   */

  const handleEditChange = (e, id, key) => {
    setEditData({
      ...editData,
      [id]: { ...editData[id], [key]: e.target.value },
    });
  };

  /**
   * checkbox click and update
   * @param {number} id userId
   * @returns {undefined}
   */

  const handleCheckboxClick = (e, id) => {
    let newSelected = new Set(selected);

    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelected(newSelected);
  };

  /**
   * select all the current page user records to delete
   * @param {object} event window Event object
   * @returns {undefined}
   */

  const SelectAllClick = (event) => {
    const low = (currentPage - 1) * rowLimit;
    const high = currentPage * rowLimit;

    let tempUsers = [...(search.length === 0 ? users : found)];
    tempUsers = tempUsers.slice(low, high);

    console.log(event.target.checked);
    let newSelected = new Set(selected);
    for (let i = 0; i < tempUsers.length; i++) {
      if (event.target.checked) {
        newSelected.add(tempUsers[i].id);
      } else {
        newSelected.delete(tempUsers[i].id);
      }
    }

    setSelected(newSelected);
  };

  // handle to delete specific selected user row

  const handleDeleteSelected = () => {
    let deletetedCount = users.length;
    const filteredUsers = users.filter((user) => !selected.has(user.id));
    deletetedCount -= filteredUsers.length;
    const filteredSearchResults = found.filter(
      (user) => !selected.has(user.id)
    );

    try {
      setUsers(filteredUsers);
      setFound(filteredSearchResults);
      enqueueSnackbar(
        `${deletetedCount} User Records been deleted Successfully!`,
        {
          variant: "error",
        }
      );
    } catch (e) {
      console.log(e);
    } finally {
      setSelected(new Set());
    }
  };

  return (
    <Stack
      className="user-list-container"
      direction="column"
      justifyContent="space-between"
      spacing={2}
    >
      <Header />
      <Box className="user-list-search-bar-container">
        <SearchBox search={search} setSearch={setSearch} />
      </Box>

      <Box className="user-list-table-view-container">
        <TableView
          data={search.length === 0 ? users : found}
          currentPage={currentPage}
          rowLimit={rowLimit}
          selected={selected}
          selectedEdit={selectedEdit}
          editData={editData}
          handleEdit={editUserData}
          handleEditChange={handleEditChange}
          handleDelete={handleDeleteSelected}
          handleCheckboxClick={handleCheckboxClick}
          handleSelectAllClick={SelectAllClick}
        />
      </Box>

      <Box className="user-list-table-actions-container">
        <ActionsArea
          data={search.length === 0 ? users : found}
          rowLimit={rowLimit}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          handleDeleteSelected={handleOpenDeleteDialog}
        />
      </Box>

      {/* Delete Confirmation  */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the selected user records?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default UserList;
