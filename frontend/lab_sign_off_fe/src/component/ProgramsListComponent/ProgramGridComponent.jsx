import { useEffect, useState, useCallback } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import axiosInstance from "../../utils/Axios";
import { tokenLoader } from "../../utils/token";
import { Bounce, toast } from "react-toastify";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import Button from "react-bootstrap/Button";
import MenuItem from "@mui/material/MenuItem";
import ProgramEditComponent from "./ProgramEditComponent";
import ProgramCreateComponent from "./ProgramCreateComponent";

const token = tokenLoader();

const ProgramGridComponent = () => {
  const [rows, setRows] = useState([]);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openUserEditModal, setOpenUserEditModal] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      let results = [];
      let nextPageUrl = "/programs/list";
      while (nextPageUrl) {
        const response = await axiosInstance.get(nextPageUrl, {
          headers: {
            Authorization: "Token " + token,
          },
        });
        results = results.concat(response.data.results);
        nextPageUrl = response.data.next;
      }
      setRows(results);
    } catch (error) {
      let errorMessage = "Error loading data";
      const errorData = error.response;
      if (
        errorData?.data.detail ===
        "You do not have permission to perform this action."
      ) {
        errorMessage = "You do not have permission to perform this action.";
      }
      console.log(errorMessage);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleMenuOpen = (event, row) => {
    setMenuAnchor(event.currentTarget);
    setSelectedRow(row);
    setSelectedRowId(null); // Reset the selectedRowId when opening the menu
  };

  const handleCreateProgramClick = () => {
    setOpenCreateModal(true);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedRow(null);
  };

  const handleEditModalClose = () => {
    setOpenUserEditModal(false);
    fetchData(); // Refresh data after closing the edit modal
  };

  const handleCreateModalClose = () => {
    setOpenCreateModal(false);
    fetchData();
  };

  const handleEditClick = () => {
    setSelectedRowId(selectedRow.id); // Set the selectedRowId only when edit is clicked
    setOpenUserEditModal(true);
    handleMenuClose();
  };

  const handleDeleteClick = async () => {
    console.log("Selected item = ", selectedRow.id);
    try {
      const response = await axiosInstance.delete(
        `programs/delete/${selectedRow.id}/`,
        {
          headers: {
            Authorization: "Token " + token,
          },
        }
      );
      handleMenuClose();
      if (response.status === 204) {
        toast.success("Program deleted successfully", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }
    } catch (error) {
      console.log(error);
    }
    fetchData();
  };

  const columns = [
    {
      field: "actions",
      headerName: "",
      width: 50,
      renderCell: (params) => (
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            handleMenuOpen(e, params.row);
          }}
        >
          <MoreVertIcon />
        </IconButton>
      ),
    },
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "program_name",
      headerName: "Program Name",
      width: 300,
      editable: false,
    },
    {
      field: "program_lenght",
      headerName: "Program lenght (Years)",
      width: 300,
      editable: false,
    },
  ];

  return (
    <>
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          disableRowSelectionOnClick
        />
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleEditClick}>Edit</MenuItem>
          <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
        </Menu>
      </Box>
      <ProgramEditComponent
        open={openUserEditModal}
        handleClose={handleEditModalClose}
        itemId={selectedRowId}
      />
      <ProgramCreateComponent
        open={openCreateModal}
        handleClose={handleCreateModalClose}
      />
      <Button onClick={handleCreateProgramClick} variant="dark">
        Create new Program
      </Button>
    </>
  );
};

export default ProgramGridComponent;
