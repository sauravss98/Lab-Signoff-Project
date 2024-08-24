import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axiosInstance from "../../utils/Axios";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Container, Typography, Paper } from "@mui/material";

// Register the required components for Chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const OverallFeedbackChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Number of Students",
        data: [],
        backgroundColor: "rgba(75,192,192,0.6)",
        borderWidth: 4,
      },
    ],
  });

  useEffect(() => {
    axiosInstance
      .get("charts/feedback/overall_ratings/")
      .then((response) => {
        const ratings = response.data.map((item) => item.rating);
        const counts = response.data.map((item) => item.count);

        setChartData({
          labels: ratings,
          datasets: [
            {
              label: "Number of Students",
              data: counts,
              backgroundColor: "rgba(75,192,192,0.6)",
              borderWidth: 4,
            },
          ],
        });
      })
      .catch((error) => console.error("Error fetching feedback data:", error));
  }, []);

  return (
    <Container maxWidth="md" style={{ marginBottom: "20px" }}>
      <Paper style={{ padding: "20px" }}>
        <Typography variant="h6" gutterBottom>
          Overall Feedback Ratings Distribution
        </Typography>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
              tooltip: {
                callbacks: {
                  label: (tooltipItem) => {
                    return `${tooltipItem.label}: ${tooltipItem.raw} students`;
                  },
                },
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: (value) => (Number.isInteger(value) ? value : ""),
                },
              },
            },
          }}
          style={{ height: "400px" }} // Adjust the height here
        />
      </Paper>
    </Container>
  );
};

export default OverallFeedbackChart;
