import React from "react";
import {
    TooltipProps,
    Payload,
} from "recharts/types/component/DefaultTooltipContent";
import { ChartTooltipContent } from "@/components/ui/chart"; // Adjust the import path as necessary

// Define the props for the CustomTooltip component
interface CustomTooltipProps extends TooltipProps {
    active?: boolean;
    payload?: Payload[];
    label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
    active,
    payload,
    label,
}) => {
    if (!active || !payload || payload.length === 0) {
        return null;
    }

    return (
        <div className="bg-background border border-border/50 rounded-lg p-2 shadow-lg">
            <div className="font-medium">{label}</div>
            {payload.map((item, index) => {
                const { dataKey, value } = item;

                // Format the value based on the dataKey
                const formattedValue =
                    dataKey === "temperature"
                        ? `${value.toLocaleString()} °C`
                        : dataKey === "humidity" || dataKey === "moisture"
                        ? `${value.toLocaleString()} %`
                        : value;

                return (
                    <div key={index} className="flex justify-between">
                        <span>
                            {dataKey.charAt(0).toUpperCase() + dataKey.slice(1)}
                            :
                        </span>
                        <span className="font-mono">{formattedValue}</span>
                    </div>
                );
            })}
        </div>
    );
};

export default CustomTooltip;
