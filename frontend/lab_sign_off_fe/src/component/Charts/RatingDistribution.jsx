import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import axiosInstance from "../../utils/Axios";
import { tokenLoader } from "../../utils/token";

const token = tokenLoader();

const RatingDistribution = () => {
  const [chartData, setChartData] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    axiosInstance
      .get("/charts/feedback/rating_distribution/", {
        headers: {
          Authorization: "Token " + token,
        },
      })
      .then((response) => {
        const ratings = Object.keys(response.data).map((rating) => ({
          rating: rating,
          count: response.data[rating],
        }));

        setChartData(ratings);
        setIsDataLoaded(true);
      })
      .catch((error) =>
        console.error("Error fetching rating distribution:", error)
      );
  }, []);

  return (
    <div style={{ width: "100%", height: 400 }}>
      <h2>Rating Distribution</h2>
      {isDataLoaded ? (
        <BarChart width={600} height={300} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="rating" />
          <YAxis
            tickFormatter={(value) => (Number.isInteger(value) ? value : "")}
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      ) : (
        <p>Loading chart data...</p>
      )}
    </div>
  );
};

export default RatingDistribution;
