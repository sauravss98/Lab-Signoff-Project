import { useCallback, useEffect, useState } from "react";
import axiosInstance from "../../../utils/Axios";
import { tokenLoader } from "../../../utils/token";
import { Bounce, toast } from "react-toastify";
import {
  Box,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import "./CoursesLabsGridComponent.css";

const token = tokenLoader();

const CoursesLabsGridComponent = () => {
  const [rows, setRows] = useState([]);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      let results = [];
      let nextPageUrl = "/courses/courses-with-sessions-list/";
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
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedRow(null);
  };

  const handleEditClick = () => {
    handleMenuClose();
    navigate(`/staff/course/${selectedRow.id}/details`);
  };

  const columns = [
    {
      field: "actions",
      headerName: "",
      width: 50,
      renderCell: (params) => (
        <IconButton
          size="small"
          className="iconButton"
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
    {
      field: "lab_sessions_count",
      headerName: "Lab Sessions",
      width: 150,
      editable: false,
    },
  ];

  return (
    <Box className="container">
      {rows.length > 0 ? (
        <DataGrid
          className="dataGrid"
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10]}
          disableRowSelectionOnClick
        />
      ) : (
        <Box className="loadingContainer">
          <CircularProgress />
        </Box>
      )}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditClick}>Edit</MenuItem>
      </Menu>
    </Box>
  );
};

export default CoursesLabsGridComponent;
