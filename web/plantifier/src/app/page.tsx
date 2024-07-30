"use client";

import React, { useEffect, useState, useRef } from "react";
import io, { Socket } from "socket.io-client"; // Import Socket type
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button"; // Adjust the import path as necessary
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TooltipProps as RechartsTooltipProps } from "recharts";
import Papa from "papaparse"; // Import PapaParse

// Chart configuration for dynamic data
const chartConfig = {
  moisture: {
    label: "Moisture",
    color: "hsl(var(--chart-1))",
  },
  temperature: {
    label: "Temperature",
    color: "hsl(var(--chart-2))",
  },
  humidity: {
    label: "Humidity",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

// Define the type for the sensor data
interface SensorData {
  time: string;
  moisture: number;
  temperature: number;
  humidity: number;
}

// Update the custom tooltip formatter to match expected types
const customTooltipFormatter = (
  value: number | string | (string | number)[],
  name: string | number
): [string, string?] => {
  switch (name) {
    case "temperature":
      return [`Temperature ${value} °C `, "Temperature"];
    case "moisture":
      return [`Moisture ${value} % `, "Moisture"];
    case "humidity":
      return [`Humidity ${value} % `, "Humidity"];
    default:
      return [String(value)];
  }
};

// Custom Tooltip Component
// Define the expected structure of the entry in payload
interface TooltipPayloadEntry {
  dataKey: keyof typeof chartConfig; // Use keyof to get valid keys from chartConfig
  value: number | string; // Adjust this type as needed
}

// Define the props for your custom tooltip
interface CustomTooltipProps {
  active?: boolean; // Optional, as it may not always be active
  payload?: TooltipPayloadEntry[]; // Use the defined entry type
  formatter: (
    value: number | string | (string | number)[],
    name: string | number
  ) => [string, string?]; // Adjust the type as needed
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  formatter,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-primary-foreground border border-primary rounded p-2 shadow-lg">
        {payload.map((entry) => (
          <p
            key={entry.dataKey}
            style={{ color: chartConfig[entry.dataKey].color }}
          >
            {formatter(entry.value, entry.dataKey)[0]}{" "}
            {/* Adjust to match your formatter's return type */}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

const Component = () => {
  const [data, setData] = useState<SensorData[]>([]);
  const [status, setStatus] = useState("disconnected");
  const [moisture, setMoisture] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const socketRef = useRef<Socket | null>(null); // Use ref to store the socket

  // Initialize socket connection
  const initializeSocket = () => {
    const newSocket = io("http://localhost:3001"); // Adjust the server URL as needed
    socketRef.current = newSocket; // Assign the new socket to the ref

    newSocket.on("connect", () => {
      console.log("Connected to server");
      setStatus("connected");
    });

    newSocket.on("serialStatus", (status) => {
      setStatus(status);
    });

    newSocket.on("sensorData", (sensorData) => {
      console.log("Sensor data received:", sensorData); // Debug log

      const currentTime = new Date().toLocaleTimeString("en-US", {
        hour12: false,
      }); // Use ISO format for time

      // Update sensor values
      setMoisture(sensorData.moisture);
      setTemperature(sensorData.temperature);
      setHumidity(sensorData.humidity);

      // Update state with new data
      setData((prevData) => {
        if (prevData.length >= 50) {
          prevData.shift(); // Remove the oldest data point
        }
        const newDataPoint = {
          time: currentTime,
          moisture: sensorData.moisture,
          humidity: sensorData.humidity,
          temperature: sensorData.temperature,
        };
        console.log("New data point added:", newDataPoint); // Debug log
        return [...prevData, newDataPoint];
      });
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from server");
      setStatus("disconnected");
    });
  };

  useEffect(() => {
    initializeSocket();

    return () => {
      socketRef.current?.disconnect(); // Safely disconnect the socket if it exists
    };
  }, []);

  const handleRefresh = async () => {
    try {
      const response = await fetch("http://localhost:3001/refresh-connection"); // Use full URL
      const text = await response.text();
      console.log(text); // Log the response message
      if (response.ok) {
        // Optionally, you can also reset the state here if needed
        // For example: setStatus("Attempting to reconnect...");
      }
    } catch (error) {
      console.error("Error refreshing connection:", error);
    }
  };

  const handleExportCSV = () => {
    const csvData = data.map((entry) => ({
      Time: entry.time,
      Moisture: entry.moisture,
      Temperature: entry.temperature,
      Humidity: entry.humidity,
    }));

    const csv = Papa.unparse(csvData);

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "sensor_data.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="m-auto flex justify-center p-4 md:p-0">
      <Card className="flex flex-col w-96 md:w-auto p-0 md:p-0">
        <CardHeader>
          <CardTitle className="text-primary">Area Chart - Gradient</CardTitle>
          <CardDescription>Showing real-time sensor data</CardDescription>
        </CardHeader>
        <CardContent className="">
          <div className="pb-4">
            <p>
              Moisture Level: Plant Sensor |{" "}
              <span className="text-muted-foreground">{moisture}</span>%
            </p>
            <p>
              Temperature: Room 1 |{" "}
              <span className="text-muted-foreground">{temperature}</span>°C
            </p>
            <p>
              Humidity: Room 1 |{" "}
              <span className="text-muted-foreground">{humidity}</span>%
            </p>
          </div>
          <ChartContainer config={chartConfig}>
            <AreaChart
              className="-ml-8"
              data={data} // Use current data array
              margin={{
                left: 0,
                right: 0,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
              />
              <YAxis yAxisId="moisture" domain={[0, 100]} />
              <YAxis
                yAxisId="temperature"
                orientation="right"
                domain={[0, 50]}
              />
              <YAxis yAxisId="humidity" orientation="right" domain={[0, 100]} />
              <Tooltip
                content={<CustomTooltip formatter={customTooltipFormatter} />}
              />
              <defs>
                <linearGradient id="fillMoisture" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-moisture)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-moisture)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient
                  id="fillTemperature"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="var(--color-temperature)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-temperature)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillHumidity" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-humidity)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-humidity)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <Area
                dataKey="moisture"
                type="natural"
                fill="url(#fillMoisture)"
                fillOpacity={0.4}
                stroke="var(--color-moisture)"
                stackId="a"
                yAxisId="moisture" // Connect to moisture Y-axis
              />
              <Area
                dataKey="temperature"
                type="natural"
                fill="url(#fillTemperature)"
                fillOpacity={0.4}
                stroke="var(--color-temperature)"
                yAxisId="temperature" // Connect to temperature Y-axis
              />
              <Area
                dataKey="humidity"
                type="natural"
                fill="url(#fillHumidity)"
                fillOpacity={0.4}
                stroke="var(--color-humidity)"
                yAxisId="humidity" // Connect to humidity Y-axis
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 font-medium leading-none">
                Status: {status} <TrendingUp className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2 leading-none text-muted-foreground">
                Showing the last 50 data points
              </div>
              {status === "disconnected" && ( // Show the button only when disconnected
                <Button className="mt-2 self-end" onClick={handleRefresh}>
                  Refresh Connection
                </Button>
              )}
              <Button className="mt-2 self-end" onClick={handleExportCSV}>
                Export Data
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Component;
