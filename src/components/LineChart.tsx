import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   Title,
//   Tooltip,
//   Legend,
//   ChartData, ChartOptions, PointElement, LineElement
// } from "chart.js";

// ChartJS.register(CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement, LineElement);

import { ChartData, ChartOptions } from "chart.js";
import 'chart.js/auto'
import axios from "axios";

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Supply and Borrow totals',
    },
  },
  scales: {
    y: {
      type: 'linear' as const,
      display: true,
      position: 'left' as const,
    },
    y1: {
      type: 'linear' as const,
      display: true,
      position: 'right' as const,
      grid: {
        drawOnChartArea: false,
      },
    },
  },
};

const headers = {
  "content-type": "application/json",
};

const requestBody = {
  query: `query MyQuery {
    getMarketDayData {
      day
      totalBorrows
      totalSupply
    }
  }
  `,
};

const graphQLOptions = {
  method: "POST",
  url:  process.env.NEXT_PUBLIC_SQUID_URL || "http://localhost:4350/graphql",
  headers,
  data: requestBody,
};

export const CHART_COLORS = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(201, 203, 207)'
};

function LineChart() {
  const [chartData, setChartData] = useState<ChartData<'line'> | null>(
    null
  );
  const [chartOptions, setChartOptions] = useState<ChartOptions<'line'> | null>(
    null
  );
  useEffect(() => {
    try {
      axios(graphQLOptions).then((response) => {
        setChartData({
          labels: [
            ...response.data.data.getMarketDayData.map((obj: any) => new Date(obj.day).toLocaleDateString()),
          ],
          datasets: [
            {
              label: "Total Borrows daily values",
              data: [
                ...response.data.data.getMarketDayData.map((obj: any) => obj.totalBorrows),
              ],
              borderColor: CHART_COLORS.red,
              backgroundColor: CHART_COLORS.red.replace(')', ', 0.5)').replace('rgb', 'rgba'),
              yAxisID: 'y',
            },
            {
              label: "Total Supply daily values",
              data: [
                ...response.data.data.getMarketDayData.map((obj: any) => obj.totalSupply),
              ],
              borderColor: CHART_COLORS.blue,
              backgroundColor: CHART_COLORS.blue.replace(')', ', 0.5)').replace('rgb', 'rgba'),
              yAxisID: 'y1',
            },
          ],
        });
      });
    } catch (err) {
      console.log("ERROR DURING AXIOS REQUEST", err);
    }

    setChartOptions(options)
  }, [])
  if (!chartData) return (<div>
      <h1>No data 🤷‍♂️!</h1>
      <h2>Try to refresh the page in a short while</h2>
    </div>);

  return (
    <div className="w-full md:col-span-2 relative lg:h-[70vh] h-[50vh] m-auto p-4 border rounded-lg bg-white">
      <Line data={chartData} options={options}></Line>
    </div>
  );
}

export default LineChart;
