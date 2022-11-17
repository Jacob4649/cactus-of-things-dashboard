/**
 * Representation of a single sensor reading
 */
interface SensorReading {

    Light: boolean

    Moisture: number

    Date: Date

}

/**
 * 
 * @param start 
 * @param end 
 * @param timeout
 * @returns 
 */
function getReadings(start: Date, end: Date, timeout: number = 5000): Promise<SensorReading[]> {
    let readings: SensorReading[] = [];

    const endpoint = 'https://cactus-of-things-backend-m7qypuwi7a-uc.a.run.app/readings';

    let url = `${endpoint}?start=${start.toISOString()}&end=${end.toISOString()}`

    return new Promise((resolve, reject) => {
        let timedOut = false;
        const timeoutID = setTimeout(() => {
            timedOut = true;
            reject(new Error('Request timeout'));
        }, timeout);

        fetch(url)
            .then(response => response.json())
            .then(json => json as SensorReading[])
            .then(readings => {
                clearTimeout(timeoutID);
                if (!timedOut)
                    resolve(readings);
            })
            .catch(error => {
                if (!timedOut) // error before timeout
                    reject(error);
            });
    });
}

export { getReadings };
export type { SensorReading };
