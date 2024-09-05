import { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import axiosInstance from "../../../utils/Axios";
import { tokenLoader } from "../../../utils/token";

const token = tokenLoader();

const PendingRequestCount = () => {
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await axiosInstance.get("/requests/list/", {
          headers: {
            Authorization: "Token " + token,
          },
        });

        const pendingRequests = response.data.results.filter(
          (request) => request.status === "pending"
        );

        setPendingCount(pendingRequests.length);
      } catch (error) {
        console.error("Error fetching pending requests", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingRequests();
  }, []);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Card sx={{ backgroundColor: "#f5f5f5", maxWidth: 300, marginLeft: 0 }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            Pending Requests
          </Typography>
          <Typography variant="h2" align="center" color="primary">
            {pendingCount}
          </Typography>
          <Typography variant="body2" align="center">
            You have {pendingCount} pending request(s).
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PendingRequestCount;
