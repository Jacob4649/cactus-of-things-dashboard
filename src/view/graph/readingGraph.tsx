import { useEffect, useState } from "react";
import { getReadings, SensorReading } from "../../model/sensorReadings";
import { LineChart, Line, ResponsiveContainer, XAxis, Tooltip } from 'recharts'
import { json } from "stream/consumers";

type ReadingGraphScale = ("1-hour" | "5-hour" | "12-hour" | "day" | "week" | "2-week" | "month")

/**
 * Properties for a ReadingGraph
 */
interface ReadingGraphProps {

    /**
     * Start {@link Date} for the graph
     */
    start?: Date

    /**
     * End {@link Date} for the graph
     */
    end?: Date

    /**
     * Scale for this graph
     */
    scale: ReadingGraphScale
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

/**
 * Graph of sensor readings
 * @param props {@link ReadingGraphProps} for this graph
 * @returns component for this graph
 */
function ReadingGraph(props: ReadingGraphProps) {

    const [start, setStart] = useState(props.start ?? new Date(Date.now() - 5 * 60 * 60 * 1000));

    const [end, setEnd] = useState(props.end ?? new Date());

    const [data, setData] = useState<SensorReading[]>();

    useEffect(() => {
        getReadings(start, end, 15000).then(response => setData(response));
    }, [start, end]);

    return <ResponsiveContainer width="100%" aspect={3}>
        <LineChart data={data}>
            <Line type="monotone" dataKey="moisture" stroke="#8884d8" dot={false} />
            <XAxis dataKey="date" type="number" domain={["auto", "auto"]} scale="time"
                tickFormatter={dateTickFormatter(props.scale)} interval="preserveStartEnd"
                minTickGap={15} />
            <Tooltip />
        </LineChart>
    </ResponsiveContainer >;
}

export { ReadingGraph }

export type { ReadingGraphScale }