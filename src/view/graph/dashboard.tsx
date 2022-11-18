import { ReadingGraph } from "./readingGraph";
import './dashboard.css';

/**
 * Dashboard for cactus-of-things
 */
export default function Dashboard() {
    return <>
        <h1>Moisture Level of Cactus</h1>
        <ReadingGraph scale="day" className="chart" />
    </>
}