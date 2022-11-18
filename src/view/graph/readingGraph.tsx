import { useEffect, useState } from "react";
import { Area, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getReadings } from "../../model/sensorReadings";

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

    moisture: number;

    date: number;

    /**
     * Light level, 1 for
     */
    lightChart: number;

}

/**
 * Graph of sensor readings
 * @param props {@link ReadingGraphProps} for this graph
 * @returns component for this graph
 */
function ReadingGraph(props: ReadingGraphProps) {

    const [start, setStart] = useState(props.start ?? new Date(Date.now() - 2 * 24 * 60 * 60 * 1000));

    const [end, setEnd] = useState(props.end ?? new Date());

    const [data, setData] = useState<ChartReading[]>();

    useEffect(() => {
        getReadings(start, end, 15000).then(response => {
            let readings = response.map(reading => ({ ...reading, lightChart: reading.light ? 1 : 0 }));
            setData(readings);
        });
    }, [start, end]);

    return <ResponsiveContainer width="100%" aspect={2.4} className={props.className}>
        <ComposedChart data={data}>
            <Tooltip labelFormatter={label => new Date(label).toLocaleString()}
                formatter={(v, n, p) => {
                    if (n == "moisture")
                        return [(v as number * 100).toFixed(2) + "%", "Moisture"];
                    else
                        return [v == 1 ? "Day" : "Night", "Lighting"];
                }} />
            <CartesianGrid horizontal={false} strokeDasharray="4 4" fill="#404040" />
            <Area dataKey="lightChart" fill="#CEC168" activeDot={false} dot={false} stroke="none" />
            <XAxis dataKey="date" type="number" domain={["auto", "auto"]} scale="time"
                tickFormatter={dateTickFormatter(props.scale)} interval="preserveStartEnd"
                minTickGap={15} />
            <YAxis dataKey="moisture" domain={[0, 1]}
                tickFormatter={tick => `${(tick * 100).toFixed(0)}%`}
                minTickGap={15} />
            <Line type="monotone" dataKey="moisture" stroke="#4FE186" dot={false} strokeWidth={4} />
        </ComposedChart>
    </ResponsiveContainer >;
}

export { ReadingGraph };
export type { ReadingGraphScale };

