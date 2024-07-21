import { useCallback, useEffect, useState } from "react";
import axiosInstance from "../../utils/Axios";
import { tokenLoader } from "../../utils/token";
import { Bounce, toast } from "react-toastify";
import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const token = tokenLoader();

const CoursesLabsGridComponent = () => {
  const [rows, setRows] = useState([]);
  const [menuAnchor, setMenuAnchor] = useState(null);

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

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
    // setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    // setSelectedRow(null);
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
    {
      field: "lab_sessions_count",
      headerName: "Lab Sessions",
      width: 300,
      editable: false,
    },
  ];

  return (
    <>
      <Box sx={{ width: "100%" }}>
        {rows.length > 0 ? (
          <DataGrid
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
          <p>Loading...</p>
        )}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
        >
          <MenuItem
          // Add your edit function here
          >
            Edit
          </MenuItem>
          <MenuItem
          // Add your delete function here
          >
            Delete
          </MenuItem>
        </Menu>
      </Box>
    </>
  );
};

export default CoursesLabsGridComponent;
