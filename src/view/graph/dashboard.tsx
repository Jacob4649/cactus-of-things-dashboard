import { ReadingGraph, ReadingGraphScale, scaleAliases } from "./readingGraph";
import './dashboard.css';
import { useState } from "react";
import Select from "react-select";

/**
 * Dashboard for cactus-of-things
 */
export default function Dashboard() {

    const [scale, setScale] = useState<ReadingGraphScale>("5-hour");

    let [start, end] = scaleToInterval(scale);

    const selectionOptions = Array.from(scaleAliases.keys())
        .map(key => ({ label: scaleAliases.get(key) as string, value: key as string }));

    return <>
        <Select options={selectionOptions}
            onChange={(v, a) => setScale(v?.value as ReadingGraphScale)}
            defaultValue={{ value: scale as string, label: scaleAliases.get(scale) as string }} />
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