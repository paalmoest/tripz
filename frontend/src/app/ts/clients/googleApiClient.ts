import * as moment from 'moment';

export interface ITrip {
    price: string;
    departrueTime: string;
    arrivalTime: string;
    carrier: string;
    flightNumber: string;
    duration: number;
    airports: IAirport[];
}

interface IAirport {
    name: string;
    code: string;
}
export async function getTrips(startDate: moment.Moment, endDate: moment.Moment, origin: string, destination: string) {
    const url = `http://localhost:5001/api/trips?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&destination=${destination}&origin=${origin}&adultcount=1`;
    const response = await fetch(url);
    return <Promise<ITrip[]>>response.json();
}
