import * as moment from 'moment';
import * as React from 'react';
import { DateRangePicker, FocusedInputShape } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import { browserHistory, withRouter, WithRouterProps } from 'react-router';
import { getDestinations, IDestination } from './clients/destinationsClient';
interface IState {
  startDate: moment.Moment;
  endDate: moment.Moment;
  focusedInput: FocusedInputShape | null;
  destinations: IDestination[];
}

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
// tslint:disable-next-line:no-any
export class App extends React.Component<WithRouterProps, IState> {

  constructor() {
    super();
    this.state = {
      startDate: moment(),
      endDate: moment(),
      focusedInput: null,
      destinations: [],
    };
  }

  onDateChange = async (args: IState) => {
    const { startDate, endDate } = args;
    this.setState({
      startDate,
      endDate
    });
    if (startDate && endDate) {
      const data = await getDestinations();
      const randomDestId = getRandomInt(0, data.destinations.length);
      const randomDest = data.destinations[randomDestId].id;
      const updatedPath = {
        pathname: `/destination/${randomDest}`,
        query: {
          startDate: startDate.format('YYYY-MM-DD'),
          endDate: endDate.format('YYYY-MM-DD')
        }
      };
      browserHistory.push(updatedPath);
    }
  }

  render() {
    const { startDate, endDate, focusedInput } = this.state;
    return (
      <div>
        <h1>Velg dato for din Oooovale weekend</h1>
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onDatesChange={this.onDateChange}
          focusedInput={focusedInput}
          onFocusChange={f => this.setState({ focusedInput: f })}
          minimumNights={0}
        />
      </div>
    );
  }

}

// tslint:disable-next-line:no-default-export export-name
export default withRouter(App);
