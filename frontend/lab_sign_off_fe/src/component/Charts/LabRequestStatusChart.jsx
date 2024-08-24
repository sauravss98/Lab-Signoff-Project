import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import axiosInstance from "../../utils/Axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const LabRequestStatusChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Request Status",
        data: [],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
        ],
      },
    ],
  });

  useEffect(() => {
    axiosInstance
      .get("/charts/lab-requests/status_distribution/")
      .then((response) => {
        // Ensure response.data is an array
        if (Array.isArray(response.data)) {
          const statuses = response.data.map(
            (item) => item.status || "Unknown Status"
          );
          const counts = response.data.map((item) => item.count || 0);

          setChartData({
            labels: statuses,
            datasets: [
              {
                label: "Request Status",
                data: counts,
                backgroundColor: [
                  "rgba(255, 99, 132, 0.6)",
                  "rgba(54, 162, 235, 0.6)",
                  "rgba(255, 206, 86, 0.6)",
                  "rgba(75, 192, 192, 0.6)",
                ],
              },
            ],
          });
        } else {
          console.error("API response is not an array:", response.data);
          // Optionally handle non-array response
        }
      })
      .catch((error) => {
        console.error("Error fetching lab request status distribution:", error);
        // Optionally set empty chartData or handle error state
        setChartData({
          labels: [],
          datasets: [
            {
              label: "Request Status",
              data: [],
              backgroundColor: [
                "rgba(255, 99, 132, 0.6)",
                "rgba(54, 162, 235, 0.6)",
                "rgba(255, 206, 86, 0.6)",
                "rgba(75, 192, 192, 0.6)",
              ],
            },
          ],
        });
      });
  }, []);

  return (
    <div>
      <h2>Lab Request Status Distribution</h2>
      <Pie data={chartData} />
    </div>
  );
};

export default LabRequestStatusChart;
