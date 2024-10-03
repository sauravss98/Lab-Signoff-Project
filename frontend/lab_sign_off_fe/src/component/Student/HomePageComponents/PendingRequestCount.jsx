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
        const response = await axiosInstance.get(
          "requests/request/pending-count/",
          {
            headers: {
              Authorization: "Token " + token,
            },
          }
        );

        setPendingCount(response.data.pending_count);
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
