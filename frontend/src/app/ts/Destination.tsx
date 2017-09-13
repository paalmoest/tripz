import * as moment from 'moment';
import * as React from 'react';
import { FocusedInputShape } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import { Link, withRouter, WithRouterProps } from 'react-router';
import { getDestinations, IDestination } from './clients/destinatioClient';
import { getTrips, ITrip } from './clients/googleApiClient';
import * as style from './Destination.css';
interface IState {
  focusedInput: FocusedInputShape | null;
  trips: ITrip[];
  destinations: IDestination[];
}

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
// tslint:disable-next-line:no-any
export class Destination extends React.Component<WithRouterProps, IState> {

  constructor(props: WithRouterProps) {
    super(props);
    this.state = {
      focusedInput: null,
      trips: [],
      destinations: [],
    };
  }

  async componentWillMount() {
    const { startDate, endDate } = this.props.location.query;
    const trip = await getTrips(moment(startDate), moment(endDate));
    const data = await getDestinations();
    this.setState({ destinations: data.destinations, trips: trip });
  }

  render() {
    const { destinations, trips } = this.state;
    const { startDate, endDate } = this.props.location.query;
    const id = parseInt(this.props.params.id, 10);
    const destinationsLoaded = destinations.length > 0;
    const nextRandomDestinationId = getRandomInt(1, destinations.length);
    const to = {
      pathname: `/destination/${nextRandomDestinationId}`,
      query: {
        startDate: moment(startDate).format('YYYY-MM-DD'),
        endDate: moment(endDate.format).format('YYYY-MM-DD')
      }
    };
    return (
      <div>
        <Link to={to}>GI MÆ NO AINNA</Link>
        {trips.map(x =>
          <div className={style.main}>
            <div>{x.price}</div>
            <div>{x.departrueTime}</div>
            <div>{x.flightNumber}</div>
          </div>
        )}
        {destinationsLoaded ?
          destinations.filter(x => x.id === id).map(x => x.restaurants.map(y => <div> {y.name}</div>))
          : null
        }
      </div>
    );
  }
}
// tslint:disable-next-line:export-name
export default withRouter(Destination);
