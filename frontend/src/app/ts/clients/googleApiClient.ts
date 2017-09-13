import * as moment from 'moment';

export interface ITrip {
  price: string;
  departrueTime: string;
}
// tslint:disable-next-line:export-name
export async function getTrips(startDate: moment.Moment, endDate: moment.Moment) {
  const url = `http://localhost:5001/api/trips?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&destination=STO&origin=OSL&adultcount=1`;
  const response = await fetch(url);
  return <Promise<ITrip[]>>response.json();
};