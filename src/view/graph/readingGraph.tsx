import { useEffect, useState } from "react";
import { Area, CartesianGrid, ComposedChart, Label, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getReadings } from "../../model/sensorReadings";

type ReadingGraphScale = ("1-hour" | "5-hour" | "12-hour" | "day" | "week" | "2-week" | "month")

/**
 * Map of scale aliases
 */
const scaleAliases: Map<ReadingGraphScale, string> = new Map()
    .set("1-hour", "Last Hour")
    .set("5-hour", "Last Five Hours")
    .set("12-hour", "Last Twelve Hours")
    .set("day", "Last Day")
    .set("week", "Last Week")
    .set("2-week", "Last Two Weeks")
    .set("month", "Last Month");

/**
 * Properties for a ReadingGraph
 */
interface ReadingGraphProps {

    /**
     * Start {@link Date} for the graph
     */
    start: Date

    /**
     * End {@link Date} for the graph
     */
    end: Date

    /**
     * Scale for this graph
     */
    scale: ReadingGraphScale

    /**
     * Classname for this graph
     */
    className?: string
}

/**
 * Gets a date tick formatter for the specified scale
 * @param scale scale to use
 */
function dateTickFormatter(scale: ReadingGraphScale): (tick: number) => string {
    switch (scale) {
        case "1-hour":
        case "5-hour":
        case "12-hour":
        case "day":
            return tick => new Date(tick).toLocaleTimeString();
        case "week":
        case "2-week":
        case "month":
            return tick => new Date(tick).toLocaleDateString();
    }
}

interface ChartReading {

    /**
     * Moisture level as a percentage
     */
    moisture: number;

    /**
     * The date in unix epoch millis
     */
    date: number;

    /**
     * Light level, 1 for light 0 for dark
     */
    lightChart: number;

}

/**
 * Graph of sensor readings
 * @param props {@link ReadingGraphProps} for this graph
 * @returns component for this graph
 */
function ReadingGraph(props: ReadingGraphProps) {

    const [data, setData] = useState<ChartReading[]>();

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getReadings(props.start, props.end, 300, 15000).then(response => {
            let readings = response.map(reading => ({ ...reading, lightChart: reading.light ? 1 : 0 }));
            setData(readings);
            setLoading(false);
        });
    }, [props.start, props.end]);

    return <ResponsiveContainer width="100%" aspect={2.4} className={props.className}>
        <ComposedChart data={data}>
            <Tooltip labelFormatter={label => new Date(label).toLocaleString()}
                formatter={(v, n, p) => {
                    if (n === "moisture")
                        return [(v as number * 100).toFixed(2) + "%", "Moisture"];
                    else
                        return [v === 1 ? "Day" : "Night", "Lighting"];
                }} />
            <CartesianGrid horizontal={false} strokeDasharray="4 4" fill="#404040" />
            <Area dataKey="lightChart" fill="#CEC168" activeDot={false} dot={false} stroke="none" />
            <XAxis dataKey="date" type="number" domain={["dataMin", "dataMax"]} scale="time"
                tickFormatter={dateTickFormatter(props.scale)} interval="preserveStartEnd"
                minTickGap={15}>
                <Label value={`Time - ${scaleAliases.get(props.scale)}`} position="insideBottom" offset={50} fill="white" />
            </XAxis>
            <YAxis dataKey="moisture" domain={[0, 1]}
                tickFormatter={tick => `${(tick * 100).toFixed(0)}%`}
                minTickGap={15}>
                <Label angle={-90} position="left" offset={-10}>
                    Moisture Level
                </Label>
            </YAxis>
            <Line type="monotone" dataKey="moisture" stroke="#4FE186" dot={false} strokeWidth={4} />
            {loading ? <ReferenceLine y="0.5" strokeDasharray="4 4">
                <Label fill="white" offset={50} position="centerTop" fontSize="4avh">
                    Loading...
                </Label>
            </ReferenceLine> : undefined}
        </ComposedChart>
    </ResponsiveContainer >;
}

export { ReadingGraph, scaleAliases };
export type { ReadingGraphScale, ChartReading };

