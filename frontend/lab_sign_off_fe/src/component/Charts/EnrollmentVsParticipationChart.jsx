import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axiosInstance from "../../utils/Axios";
import "./EnrollmentVsParticipationChart.css"; // Import your CSS file

const EnrollmentVsParticipationChart = () => {
  // Initialize chartData with default values to prevent errors
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Enrollments",
        data: [],
        backgroundColor: "rgba(255, 159, 64, 0.6)",
      },
      {
        label: "Participation",
        data: [],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  });

  useEffect(() => {
    axiosInstance
      .get("/charts/enrollment-vs-participation/enrollment_vs_participation/")
      .then((response) => {
        // Check the structure of the response data
        console.log(response.data);

        if (!response.data || response.data.length === 0) {
          // Handle empty response
          setChartData({
            labels: [],
            datasets: [
              {
                label: "Enrollments",
                data: [],
                backgroundColor: "rgba(255, 159, 64, 0.6)",
              },
              {
                label: "Participation",
                data: [],
                backgroundColor: "rgba(54, 162, 235, 0.6)",
              },
            ],
          });
          return;
        }

        // Extract data from response
        const courses = response.data.map((item) => item.course_name);
        const enrollments = response.data.map((item) => item.enrollment_count);
        const participation = response.data.map(
          (item) => item.participation_count
        );

        // Update chartData state
        setChartData({
          labels: courses,
          datasets: [
            {
              label: "Enrollments",
              data: enrollments,
              backgroundColor: "rgba(255, 159, 64, 0.6)",
            },
            {
              label: "Participation",
              data: participation,
              backgroundColor: "rgba(54, 162, 235, 0.6)",
            },
          ],
        });
      })
      .catch((error) => {
        console.error("Error fetching enrollment vs. participation:", error);
      });
  }, []);

  return (
    <div className="chart-container">
      <h2>Enrollment vs. Participation</h2>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Courses",
              },
              ticks: {
                autoSkip: false, // Prevents skipping of x-axis labels
                maxRotation: 90, // Rotates x-axis labels for better fit
                minRotation: 45,
              },
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Counts",
              },
            },
          },
        }}
      />
    </div>
  );
};

export default EnrollmentVsParticipationChart;
