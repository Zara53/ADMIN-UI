import React, { useState } from "react";
import styles from "./TableHeadRow.module.css";

const TableHead = ({
  tableData,
  error,
  filteredData,
  setTableData,
  setFilteredData,
  handleSelectAll,
  handleSelectRow,
  isPageFullySelected,
}) => {
  const [editedRow, setEditedRow] = useState(null);

  //To edit name,email,role of a row.
  const handleEditClick = (row) => {
    setEditedRow({ ...row });
  };
  const handleInputChange = (field, value) => {
    setEditedRow((prevRow) => ({
      ...prevRow,
      [field]: value,
    }));
  };

  //To save the edited data.
  const handleSaveClick = () => {
    setTableData((prevTableData) =>
      prevTableData.map((row) => (row.id === editedRow.id ? editedRow : row))
    );
    setFilteredData((prevFilteredData) =>
      prevFilteredData.map((row) => (row.id === editedRow.id ? editedRow : row))
    );
    setEditedRow(null);
  };

  //To delete a row.
  const handleDeleteClick = (id) => {
    setTableData((prevTableData) =>
      prevTableData.filter((row) => row.id !== id)
    );
    setFilteredData((prevFilteredData) =>
      prevFilteredData.filter((row) => row.id !== id)
    );
  };

  return (
    <div className={styles.tableContainer}>
      <table>
        <thead>
          <tr>
            <th>
              <input
                className={styles.checkbox}
                type="checkbox"
                checked={isPageFullySelected}
                onChange={handleSelectAll}
              />
            </th>
            <th>Id</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {error ? (
            <tr>
              <td colSpan="6">{error}</td>
            </tr>
          ) : filteredData.length === 0 ? (
            <tr>
              <td colSpan="6">No data found.Please try again.</td>
            </tr>
          ) : (
            tableData.map((row) => (
              <tr
                key={row.id}
                style={{
                  backgroundColor: row.isSelected ? "gray" : "white",
                }}
              >
                <td>
                  <input
                    className={styles.checkbox}
                    type="checkbox"
                    checked={row.isSelected}
                    onChange={() => handleSelectRow(row.id)}
                  />
                </td>
                <td>{row.id}</td>

                {editedRow && editedRow.id === row.id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        value={editedRow.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={editedRow.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={editedRow.role}
                        onChange={(e) =>
                          handleInputChange("role", e.target.value)
                        }
                      />
                    </td>
                  </>
                ) : (
                  <>
                    <td>{row.name}</td>
                    <td>{row.email}</td>
                    <td>{row.role}</td>
                  </>
                )}

                <td>
                  {editedRow && editedRow.id === row.id ? (
                    <button
                      className={styles.button1}
                      onClick={handleSaveClick}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      className={styles.button1}
                      onClick={() => handleEditClick(row)}
                    >
                      Edit
                    </button>
                  )}
                  <button
                    className={styles.button2}
                    onClick={() => handleDeleteClick(row.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableHead;
