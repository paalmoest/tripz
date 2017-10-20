import * as moment from 'moment';
import * as React from 'react';
import { FocusedInputShape } from 'react-dates';
import { Link, withRouter, WithRouterProps } from 'react-router';
import { getDestinations, IDestination } from './clients/destinationsClient';
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
    const id = parseInt(this.props.params.id, 10)
    const origin = 'OSL';
    const data = await getDestinations();
    const destination = data.destinations.find(x => x.id === id);
    if (destination) {
      const trip = await getTrips(moment(startDate), moment(endDate), origin, destination.cityIATA);
      this.setState({ destinations: data.destinations, trips: trip });
    }
  }

  render() {
    const { destinations, trips } = this.state;
    const { startDate, endDate } = this.props.location.query;
    const id = parseInt(this.props.params.id, 10);
    const destination = destinations.find(x => x.id === id);
    if (!destination) {
      return null;
    }
    const nextRandomDestinationId = getRandomInt(1, destinations.length);
    const to = {
      pathname: `/destination/${nextRandomDestinationId}`,
      query: {
        startDate: moment(startDate).format('YYYY-MM-DD'),
        endDate: moment(endDate.format).format('YYYY-MM-DD'),
      }
    };
    return (
      <div>
        <div className={style.nextDestination}>
          <Link to={to}>GI MÆ NO AINNA</Link>
        </div>
        <div>Fly til</div>
        {trips.map((x, index) =>
          <div key={index} className={style.flightTripItem}>
            <div>{moment(x.departrueTime).format('MMMM Do YYYY HH:mm')}</div>
            <div>{x.flightNumber}</div>
            <div>{x.price}</div>
            <div>{x.airport}</div>
          </div>
        )}
        <div className={style.restaurantSectionTitle}>Awesome Resturants</div>
        <div>
          {
            destination.restaurants.map(x =>
              <div
                key={x.id}
                className={style.restaurantItem}>
                {x.name}
              </div>
            )
          }
        </div>
      </div>
    );
  }
}
export default withRouter(Destination);
