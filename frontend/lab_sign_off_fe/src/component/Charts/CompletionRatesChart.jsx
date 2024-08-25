import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axiosInstance from "../../utils/Axios";

const CompletionRatesChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Completed",
        data: [],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "Not Completed",
        data: [],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  });

  useEffect(() => {
    axiosInstance
      .get("/charts/lab-sessions/completion_rates/")
      .then((response) => {
        const data = Array.isArray(response.data) ? response.data : [];

        const sessions = data.map((item) => item.session || "");
        const completed = data.map((item) => item.completed || 0);
        const notCompleted = data.map((item) => item.not_completed || 0);
        console.log(data);
        setChartData({
          labels: sessions,
          datasets: [
            {
              label: "Completed",
              data: completed,
              backgroundColor: "rgba(54, 162, 235, 0.6)",
            },
            {
              label: "Not Completed",
              data: notCompleted,
              backgroundColor: "rgba(255, 99, 132, 0.6)",
            },
          ],
        });
      })
      .catch((error) => {
        console.error("Error fetching completion rates:", error);
      });
  }, []);

  return (
    <div>
      <h2>Lab Completion Rates</h2>
      <Bar data={chartData} />
    </div>
  );
};

export default CompletionRatesChart;
