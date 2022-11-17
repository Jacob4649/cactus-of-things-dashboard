import { useEffect, useState } from "react";
import { getReadings, SensorReading } from "../../model/sensorReadings";
import { LineChart, Line, ResponsiveContainer, XAxis, Tooltip } from 'recharts'

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
}

/**
 * Graph of sensor readings
 * @param props {@link ReadingGraphProps} for this graph
 * @returns component for this graph
 */
export default function ReadingGraph(props: ReadingGraphProps) {

    const [start, setStart] = useState(props.start ?? new Date(Date.now() - 5 * 60 * 60 * 1000));

    const [end, setEnd] = useState(props.end ?? new Date());

    const [data, setData] = useState<SensorReading[]>();

    useEffect(() => {
        getReadings(start, end, 15000).then(response => setData(response));
    }, []);

    return <ResponsiveContainer width="100%" aspect={3}>
        <LineChart data={data}>
            <Line type="monotone" dataKey="moisture" stroke="#8884d8" dot={false} />
            <XAxis dataKey="date" type="number" />
            <Tooltip />
        </LineChart>
    </ResponsiveContainer >;
}