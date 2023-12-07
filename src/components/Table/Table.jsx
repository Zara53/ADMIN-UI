import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import TableHead from "../TableHeadRow/TableHeadRow";
import fetchData from "../../Api/api";
import Pagination from "../Pagination/Pagination";
const Table = () => {
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  //Fetch data from api.
  useEffect(() => {
    const fetchDataFromApi = async () => {
      try {
        const data = await fetchData();
        const dataWithSelection = data.map((row) => ({
          ...row,
          isSelected: false,
        }));
        setTableData(dataWithSelection);
        setFilteredData(dataWithSelection);
      } catch (error) {
        setError(
          "An error occurred while fetching data.Please try after sometime."
        );
      }
    };

    fetchDataFromApi();
  }, []);

  //To set the pagination.
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  //To handle search and show filtered data.
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = tableData.filter(
      (row) =>
        row.name.toLowerCase().includes(query) ||
        row.email.toLowerCase().includes(query) ||
        row.role.toLowerCase().includes(query)
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  //To select all the rows.
  const handleSelectAll = () => {
    setTableData((prevTableData) =>
      prevTableData.map((row) => ({ ...row, isSelected: !selectedRows.length }))
    );
    setFilteredData((prevFilteredData) =>
      prevFilteredData.map((row) => ({
        ...row,
        isSelected: !selectedRows.length,
      }))
    );
    setSelectedRows((prevSelectedRows) =>
      !prevSelectedRows.length
        ? filteredData
            .slice(indexOfFirstItem, indexOfLastItem)
            .map((row) => row.id)
        : []
    );
  };

  //To handle the Delete Selected Button and show updated data.
  const handleDeleteSelected = () => {
    const updatedTableData = tableData.filter(
      (row) => !selectedRows.includes(row.id)
    );
    const updatedFilteredData = filteredData.filter(
      (row) => !selectedRows.includes(row.id)
    );
    const updatedTableDataWithSelection = updatedTableData.map((row) => ({
      ...row,
      isSelected: false,
    }));
    const updatedFilteredDataWithSelection = updatedFilteredData.map((row) => ({
      ...row,
      isSelected: false,
    }));
    setSelectedRows([]);
    setTableData(updatedTableDataWithSelection);
    setFilteredData(updatedFilteredDataWithSelection);
    setCurrentPage(1);
  };

  //To select a one or more row.
  const handleSelectRow = (id) => {
    const updatedTableData = tableData.map((row) =>
      row.id === id ? { ...row, isSelected: !row.isSelected } : row
    );
    setTableData(updatedTableData);
    const updatedFilteredData = filteredData.map((row) =>
      row.id === id ? { ...row, isSelected: !row.isSelected } : row
    );
    setFilteredData(updatedFilteredData);
    const updatedSelectedRows = updatedFilteredData
      .filter((row) => row.isSelected)
      .map((row) => row.id);
    setSelectedRows(updatedSelectedRows);
  };

  //To uncheck the headcheckbox.
  const isPageFullySelected = currentItems.every((row) => row.isSelected);

  return (
    <>
      <Header
        placeholder="   SEARCH BY NAME, EMAIL OR ROLE"
        searchQuery={searchQuery}
        handleSearch={handleSearch}
      />
      <TableHead
        tableData={currentItems}
        error={error}
        filteredData={filteredData}
        setTableData={setTableData}
        setFilteredData={setFilteredData}
        handleSelectAll={handleSelectAll}
        handleSelectRow={handleSelectRow}
        isPageFullySelected={isPageFullySelected}
      />
      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={filteredData.length}
        currentPage={currentPage}
        paginate={paginate}
        handleDeleteSelected={handleDeleteSelected}
      />
    </>
  );
};

export default Table;
