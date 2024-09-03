/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axiosInstance from "../../utils/Axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CompletionRatesByCourseChart = ({ courseName }) => {
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
    if (!courseName) return;

    axiosInstance
      .get(
        `/charts/lab-sessions/completion_rates_by_course/?course_name=${encodeURIComponent(
          courseName
        )}`
      )
      .then((response) => {
        const data = Array.isArray(response.data) ? response.data : [];

        const sessions = data.map((item) => item.session || "");
        const completed = data.map((item) => item.completed || 0);
        const notCompleted = data.map((item) => item.not_completed || 0);

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
        console.error("Error fetching completion rates for the course:", error);
      });
  }, [courseName]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Lab Completion Rates for ${courseName}`,
      },
    },
  };

  return (
    <div>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default CompletionRatesByCourseChart;
