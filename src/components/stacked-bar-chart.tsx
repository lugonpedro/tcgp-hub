import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface StackedBarChartProps {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
  }[];
}

export default function StackedBarChart({ labels, datasets }: StackedBarChartProps) {
  return (
    <Bar
      options={{
        plugins: {
          title: {
            display: false,
            text: "Chart.js Bar Chart - Stacked",
          },
        },
        responsive: true,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
          },
        },
      }}
      data={{
        labels,
        datasets,
      }}
    />
  );
}
