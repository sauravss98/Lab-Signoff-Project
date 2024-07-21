import { Grid } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/Axios";
import { tokenLoader } from "../../utils/token";
import { Bounce, toast } from "react-toastify";

const token = tokenLoader();

const CoursesLabsDetailPage = () => {
  const { selectedRowId } = useParams();
  const [courseDetails, setCourseDetails] = useState({});

  const fetchData = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/courses/${selectedRowId}/`, {
        headers: {
          Authorization: "Token " + token,
        },
      });
      setCourseDetails(response.data); // Assign response data to courseDetails
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
  }, [selectedRowId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  console.log(courseDetails);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <h1>Course Details for ID: {selectedRowId}</h1>
      </Grid>
      <Grid item xs={12}>
        {courseDetails.id && <p>Course Description: {courseDetails.id}</p>}
      </Grid>
      <Grid item xs={12}>
        {courseDetails.course_name && (
          <p>Course Name: {courseDetails.course_name}</p>
        )}
      </Grid>
      <Grid item xs={12}>
        {/* Add more course details here */}
      </Grid>
    </Grid>
  );
};

export default CoursesLabsDetailPage;
