import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axiosInstance from "../../utils/Axios";
import "./styles.css";

const CourseEnrollmentChart = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    axiosInstance
      .get("/charts/enrollment/course_count/")
      .then((response) => {
        const data = response.data || [];
        if (Array.isArray(data) && data.length > 0) {
          const courses = data.map(
            (item) => item.course_name || "Unknown Course"
          );
          const enrollments = data.map(
            (item) => item.total_course_enrollments || 0
          );

          setChartData({
            labels: courses,
            datasets: [
              {
                label: "Enrollments",
                data: enrollments,
                backgroundColor: "rgba(255, 206, 86, 0.6)",
              },
            ],
          });
        } else {
          console.error("Unexpected data format:", data);
          setChartData({
            labels: [],
            datasets: [
              {
                label: "Enrollments",
                data: [],
                backgroundColor: "rgba(255, 206, 86, 0.6)",
              },
            ],
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching course enrollments:", error);
        setChartData({
          labels: [],
          datasets: [
            {
              label: "Enrollments",
              data: [],
              backgroundColor: "rgba(255, 206, 86, 0.6)",
            },
          ],
        });
      });
  }, []);

  return (
    <div className="chart-container">
      <h2>Course Enrollment Counts</h2>
      <Bar
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
            },
            y: {
              beginAtZero: true,
              ticks: {
                // Ensure that y-axis ticks are whole numbers
                callback: function (value) {
                  return Number.isInteger(value) ? value : "";
                },
              },
            },
          },
        }}
      />
    </div>
  );
};

export default CourseEnrollmentChart;
