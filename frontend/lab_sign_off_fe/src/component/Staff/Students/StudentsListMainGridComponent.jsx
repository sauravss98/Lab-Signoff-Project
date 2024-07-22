import { useCallback, useEffect, useState } from "react";
import { tokenLoader } from "../../../utils/token";
import { useNavigate } from "react-router-dom";
import {
  Box,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { DataGrid } from "@mui/x-data-grid";
import { Bounce, toast } from "react-toastify";
import { Chip } from "@mui/material";
import axiosInstance from "../../../utils/Axios";

const token = tokenLoader();

const StudentsListMainGridComponent = () => {
  const [rows, setRows] = useState([]);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      let results = [];
      let nextPageUrl = "/lab-session/students-with-courses/";
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
    navigate(`/staff/student/${selectedRow.id}/details`);
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
    { field: "id", headerName: "ID", width: 50 },
    {
      field: "first_name",
      headerName: "First name",
      width: 150,
      editable: false,
    },
    {
      field: "last_name",
      headerName: "Last name",
      width: 150,
      editable: false,
    },
    {
      field: "email",
      headerName: "Email",
      width: 300,
      editable: false,
    },
    {
      field: "enrolled_courses",
      headerName: "Enrolled Courses",
      width: 600,
      renderCell: (params) => (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {params.row.enrolled_courses.length > 0 ? (
            params.row.enrolled_courses.map((course) => (
              <Chip key={course.id} label={course.course_name} size="small" />
            ))
          ) : (
            <Chip label="No Courses" size="small" color="warning" />
          )}
        </Box>
      ),
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
        <MenuItem
        // Add your delete function here
        >
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default StudentsListMainGridComponent;
