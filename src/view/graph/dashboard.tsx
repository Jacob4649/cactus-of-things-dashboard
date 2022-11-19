import { ReadingGraph, ReadingGraphScale } from "./readingGraph";
import './dashboard.css';
import { useState } from "react";
import Select from "react-select";
import { SingleValue, ActionMeta, InputActionMeta } from "react-select/dist/declarations/src";

/**
 * Dashboard for cactus-of-things
 */
export default function Dashboard() {

    const [scale, setScale] = useState<ReadingGraphScale>("day");

    let [start, end] = scaleToInterval(scale);

    const selectionOptions = [
        { value: "1-hour", label: "Last Hour" },
        { value: "5-hour", label: "Last Five Hours" },
        { value: "12-hour", label: "Last Twelve Hours" },
        { value: "day", label: "Last Day" },
        { value: "week", label: "Last Week" },
        { value: "2-week", label: "Last Two Weeks" },
        { value: "month", label: "Last Month" }
    ]

    return <>
        <h1>Moisture Level of Cactus</h1>
        <Select options={selectionOptions}
            onChange={(v, a) => setScale(v?.value as ReadingGraphScale)}
            defaultValue={{ value: "5-hour", label: "Last Five Hours" }} />
        <ReadingGraph start={start} end={end} scale={scale} className="chart" />
    </>
}

/**
 * Converts an {@link ReadingGraphScale} to a interval of dates
 * @param scale {@link ReadingGraphScale} to convert
 * @returns interval of {@link Date}s
 */
function scaleToInterval(scale: ReadingGraphScale): [start: Date, end: Date] {

    let now = new Date();
    let then = Date.now();

    switch (scale) {
        case "1-hour":
            then -= 60 * 60 * 1000;
            break;
        case "5-hour":
            then -= 5 * 60 * 60 * 1000;
            break;
        case "12-hour":
            then -= 12 * 60 * 60 * 1000;
            break;
        case "day":
            then -= 24 * 60 * 60 * 1000;
            break;
        case "week":
            then -= 7 * 24 * 60 * 60 * 1000;
            break;
        case "2-week":
            then -= 14 * 24 * 60 * 60 * 1000;
            break;
        case "month":
            then -= 28 * 24 * 60 * 60 * 1000;
            break;
    }

    return [new Date(then), now];
}