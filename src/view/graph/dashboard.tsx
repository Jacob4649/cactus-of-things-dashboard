import { ReadingGraph } from "./readingGraph";

/**
 * Dashboard for cactus-of-things
 */
export default function Dashboard() {
    return <>
        <ReadingGraph scale="day"></ReadingGraph>
    </>
}