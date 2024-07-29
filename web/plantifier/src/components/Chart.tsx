// src/components/Chart.tsx
import React from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    Legend,
    TimeScale,
    ChartOptions,
} from "chart.js";
import "chartjs-adapter-date-fns"; // Ensure this is imported

// Register the necessary components
ChartJS.register(
    LineElement,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    Legend,
    TimeScale // Register TimeScale for using date on the x-axis
);

interface ChartProps {
    chartData: {
        labels: (string | Date)[];
        datasets: {
            label: string;
            data: { x: Date; y: number }[];
            borderColor: string;
            borderWidth: number;
            fill: boolean;
        }[];
    };
}

const Chart: React.FC<ChartProps> = ({ chartData }) => {
    const options: ChartOptions<"line"> = {
        responsive: true,
        scales: {
            x: {
                type: "time", // This should be explicitly set to "time"
                time: {
                    unit: "second", // Specify the time unit here
                },
                title: {
                    display: true,
                    text: "Time",
                },
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Value",
                },
            },
        },
    };

    return <Line data={chartData} options={options} />;
};

export default Chart;
