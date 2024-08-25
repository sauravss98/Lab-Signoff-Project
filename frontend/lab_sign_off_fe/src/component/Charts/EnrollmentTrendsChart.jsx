import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import axiosInstance from "../../utils/Axios";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
);

const EnrollmentTrendsChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Enrollments Over Time",
        data: [],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        fill: false,
      },
    ],
  });

  useEffect(() => {
    axiosInstance
      .get("/charts/enrollment/trends/")
      .then((response) => {
        const dates = response.data.map((item) => item.enrollment_date__date);
        const enrollments = response.data.map((item) => item.enrollments);

        setChartData({
          labels: dates,
          datasets: [
            {
              label: "Enrollments Over Time",
              data: enrollments,
              backgroundColor: "rgba(54, 162, 235, 0.6)",
              borderColor: "rgba(54, 162, 235, 1)",
              fill: false,
            },
          ],
        });
      })
      .catch((error) =>
        console.error("Error fetching enrollment trends:", error)
      );
  }, []);

  return (
    <div style={{ position: "relative", height: "400px", width: "100%" }}>
      <h2>Enrollment Trends</h2>
      <Line
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  return `${context.label}: ${context.raw}`;
                },
              },
            },
          },
          scales: {
            x: {
              beginAtZero: true,
              ticks: {
                autoSkip: true,
                maxRotation: 45,
                minRotation: 30,
              },
            },
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => (Number.isInteger(value) ? value : ""),
              },
            },
          },
        }}
      />
    </div>
  );
};

export default EnrollmentTrendsChart;
