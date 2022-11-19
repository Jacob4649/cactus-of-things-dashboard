/**
 * Representation of a single sensor reading
 */
interface ServerSensorReading {

    /**
     * Light level (0 - Dark, 1 - Bright)
     */
    Light: number

    /**
     * Moisture level (0 - 4095)
     */
    Moisture: number

    /**
     * Reading time in RFC3339
     */
    Date: string

}

/**
 * Representation of a single sensor reading for use by this application
 */
interface SensorReading {

    /**
     * Whether it was bright
     */
    light: boolean

    /**
     * Date in unix epoch milliseconds
     */
    date: number

    /**
     * Moisture level (0% - 100%)
     */
    moisture: number

}

/**
 * 
 * @param start start of period to get readings from
 * @param end end of period to get readings from
 * @param timeout timeout before failing to fetch readings
 * @returns the fetched readings as a {@link Promise} for an array of {@link SensorReading}s
 */
function getReadings(start: Date, end: Date, timeout: number = 5000): Promise<SensorReading[]> {
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
            .then(json => json as ServerSensorReading[])
            .then(readings => readings.map(reading => ({
                light: reading.Light == 1,
                moisture: reading.Moisture / 4095,
                date: Date.parse(reading.Date)
            })))
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
