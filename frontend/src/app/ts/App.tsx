import * as moment from 'moment';
import * as React from 'react';
import { DateRangePicker, FocusedInputShape } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import { withRouter, WithRouterProps } from 'react-router';
import { getTrips, ITrip } from './clients/googleApiClient';
interface IState {
  startDate: moment.Moment;
  endDate: moment.Moment;
  focusedInput: FocusedInputShape | null;
  trips: ITrip[];
}
// tslint:disable-next-line:no-any
export class App extends React.Component<WithRouterProps, IState> {

  constructor() {
    super();
    this.state = {
      startDate: moment(),
      endDate: moment(),
      focusedInput: null,
      trips: []
    };
  }
  onDateChange = async (args: IState) => {
    const { startDate, endDate } = args;
    this.setState({
      startDate,
      endDate
    });
    if (startDate && endDate) {
      const trip = await getTrips(startDate, endDate);
      this.setState({
        trips: trip
      });
    }
  }

  render() {
    const { trips, startDate, endDate, focusedInput } = this.state;
    return (
      <div>
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onDatesChange={this.onDateChange}
          focusedInput={focusedInput}
          onFocusChange={f => this.setState({ focusedInput: f })}
          minimumNights={0}
        />
        {trips.map(x =>
          <div>
            <div>{x.price}</div>
            <div>{x.departrueTime}</div>
            <div>{x.flightNumber}</div>
          </div>

        )}
      </div>
    );
  }
}

// tslint:disable-next-line:no-default-export export-name
export default withRouter(App);
