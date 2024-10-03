import { useEffect, useState } from "react";
import { Scatter } from "react-chartjs-2";
import axiosInstance from "../../utils/Axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const CompletionVsFeedbackChart = () => {
  const [chartData, setChartData] = useState({
    datasets: [
      {
        label: "Completion vs. Feedback",
        data: [],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  });

  useEffect(() => {
    axiosInstance
      .get("/charts/completion-vs-feedback/correlation/")
      .then((response) => {
        if (Array.isArray(response.data)) {
          const dataPoints = response.data.map((item) => ({
            x: item.completion_rate,
            y: item.average_feedback,
            name: item.name,
          }));

          setChartData({
            datasets: [
              {
                label: "Completion vs. Feedback",
                data: dataPoints,
                backgroundColor: "rgba(75, 192, 192, 0.6)",
              },
            ],
          });
        } else {
          console.error("Response data is not an array:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching completion vs. feedback data:", error);
        setChartData({
          datasets: [
            {
              label: "Completion vs. Feedback",
              data: [],
              backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
          ],
        });
      });
  }, []);

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const { x, y } = context.raw;
            const name = context.raw.name;
            return `${name}: Completion Rate = ${x}%, Feedback = ${y}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Completion Rate (%)",
        },
      },
      y: {
        title: {
          display: true,
          text: "Average Feedback",
        },
        suggestedMin: 0,
        suggestedMax: 5,
      },
    },
  };

  return (
    <div>
      <h2>Completion vs. Feedback Correlation</h2>
      <Scatter data={chartData} options={options} />
    </div>
  );
};

export default CompletionVsFeedbackChart;
