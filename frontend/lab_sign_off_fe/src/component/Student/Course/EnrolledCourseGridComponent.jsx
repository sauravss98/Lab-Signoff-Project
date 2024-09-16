import { DataGrid } from "@mui/x-data-grid";
import { Container } from "react-bootstrap";
import axiosInstance from "../../../utils/Axios";
import { tokenLoader } from "../../../utils/token";
import { useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";
import { IconButton, Menu, MenuItem, Typography, Box } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";

const token = tokenLoader();

const EnrolledCourseGridComponent = () => {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRow, setSelectedRow] = useState(null);

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(
        "lab-session/student-enrollment-details/",
        {
          headers: {
            Authorization: "Token " + token,
          },
        }
      );
      setData(response.data.enrolled_courses);
      setLoading(false);
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
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMenuOpen = (event, row) => {
    setMenuAnchor(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedRow(null);
  };

  const handleEdit = () => {
    navigate(`/student/course/${selectedRow.id}/details`);
    handleMenuClose();
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
    { field: "course_name", headerName: "Course Name", width: 200 },
  ];

  const rows = data.map((course) => ({
    id: course.id,
    course_name: course.course_name,
  }));

  return (
    <Container>
      <Box
        sx={{
          margin: "20px 0",
          padding: "20px",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Enrolled Courses
        </Typography>
        <div style={{ height: 400, width: "100%" }}>
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
            loading={loading}
          />
        </div>
      </Box>
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
      </Menu>
    </Container>
  );
};

export default EnrolledCourseGridComponent;
