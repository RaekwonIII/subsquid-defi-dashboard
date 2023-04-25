import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";

import { ChartData, ChartOptions } from "chart.js";
import 'chart.js/auto'

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
    setChartData({
      labels: [
        'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'
      ],
      datasets: [
        {
          label: "Total Borrows daily values",
          data: [18127, 22201, 17938, 24182, 17842, 22475, 19455],
          borderColor: CHART_COLORS.red,
          backgroundColor: CHART_COLORS.red.replace(')', ', 0.5)').replace('rgb', 'rgba'),
          yAxisID: 'y',
        },
        {
          label: "Total Supply daily values",
          data: [2220.1, 1793.8, 2418.2, 1784.2, 2247.5, 1945.5, 1812.7],
          borderColor: CHART_COLORS.blue,
          backgroundColor: CHART_COLORS.blue.replace(')', ', 0.5)').replace('rgb', 'rgba'),
          yAxisID: 'y1',
        },
      ],
    });

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
