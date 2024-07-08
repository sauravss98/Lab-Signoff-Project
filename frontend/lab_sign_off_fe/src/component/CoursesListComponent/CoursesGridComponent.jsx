import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axiosInstance from "../../utils/Axios";
import { tokenLoader } from "../../utils/token";
import { useCallback, useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const token = tokenLoader();

const CoursesGridComponent = () => {
  const [rows, setRows] = useState([]);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const fetchData = useCallback(async () => {
    try {
      let results = [];
      let nextPageUrl = "/courses/list/";
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

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedRow(null);
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
      field: "course_name",
      headerName: "Course name",
      width: 300,
      editable: false,
    },
  ];

  return (
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
        <MenuItem
        // onClick={handleEditClick}
        >
          Edit
        </MenuItem>
        <MenuItem
        // onClick={handleDeleteClick}
        >
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default CoursesGridComponent;
