import { useEffect, useState } from "react";
import { Label, LabelList, PolarAngleAxis, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart, ResponsiveContainer, XAxis } from "recharts";
import { getCurrentReading } from "../../model/sensorReadings";
import { ChartReading } from "./readingGraph";
import './currentReadingGraph.css';
import refresh from './refresh.svg';

/**
 * Props for a {@link CurrentReadingGraph}
 */
interface CurrentReadingGraphProps {

    /**
     * Classname for this {@link CurrentReadingGraph}
     */
    className?: string;

}

/**
 * Component for viewing the current sensor output
 * @param props {@link CurrentReadingGraphProps} for the component
 * @returns a component
 */
export default function CurrentReadingGraph(props: CurrentReadingGraphProps) {

    const refreshData = () => {
        getCurrentReading(15000).then(response => {
            let readings = [{
                ...response, lightChart: response.light ? 1 : 0
            }];
            setData(readings);
        });
    };

    const [data, setData] = useState<ChartReading[]>();

    useEffect(refreshData, []);

    return <div className={"current-reading-graph " + (props.className ?? "")}>
        {/* <div className="refresh-current-readings-button" onClick={refreshData}>
            <img alt="refresh" src={refresh} className="refresh-current-readings-image">
            </img>
        </div> */}
        <span className="current-reading-info">
            <span className="current-reading-info-header">
                CURRENT READING <br></br>
            </span>
            {
                data === undefined ? "LOADING" :
                    data.length === 0 ? "ERROR FETCHING" :
                        (new Date(data[0].date).toLocaleTimeString() + " / ")
            }
            <span className={data !== undefined && data.length > 0 ?
                data[0].lightChart === 1 ? "time-text time-text-light" :
                    "time-text time-text-dark" : undefined}>
                {
                    data !== undefined && data.length > 0 ?
                        data[0].lightChart === 1 ? "LIGHT" :
                            "DARK" : ""
                }
            </span>
        </span>
        <ResponsiveContainer width="100%" aspect={1}>
            <RadialBarChart startAngle={200} endAngle={-20}
                data={data}
                innerRadius="50%"
                outerRadius="75%">
                <PolarGrid gridType="circle" />
                <PolarAngleAxis
                    axisLineType="circle"
                    tickFormatter={(v, i) => (v * 100).toFixed(0) + "%"}
                    type="number"
                    domain={[0, 1]}
                    tick={true}
                    tickLine={true}
                    stroke="#bbb"
                />
                <PolarAngleAxis
                    axisLineType="polygon"
                    type="number"
                    tick={false}
                    tickLine={true}
                    stroke="#bbb" />
                <RadialBar dataKey="moisture" fill="#0C703E" >
                    <LabelList dataKey="moisture"
                        fill="#fff"
                        position="insideStart"
                        formatter={(moisture: number) => `Moisture: ${(moisture * 100).toFixed(0)}%`} />
                </RadialBar>
            </RadialBarChart>
        </ResponsiveContainer >
    </div>
}