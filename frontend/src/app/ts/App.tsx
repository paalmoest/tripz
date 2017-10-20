import * as moment from "moment";
import "moment/locale/nb";
import * as React from "react";
import { withRouter, WithRouterProps } from "react-router";
import * as style from "./App.css";
interface IState {
  startDate: moment.Moment;
  endDate: moment.Moment;
}

moment.locale("nb");

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export class App extends React.Component<WithRouterProps, IState> {
  constructor() {
    super();
    this.state = {
      startDate: moment(),
      endDate: moment()
    };
  }

  render() {
    const nextThursday = moment().weekday(3);
    const correspondingSunday = nextThursday.clone().add(3, "days");
    const numberOfWeeksToShow = 20;
    let i = 0;
    const weeks = [];
    while (i < numberOfWeeksToShow) {
      weeks.push({
        first: nextThursday.clone().add(i, "weeks"),
        last: correspondingSunday.clone().add(i, "weeks")
      });
      i++;
    }
    const NUMBER_OF_DESTINATIONS = 2;
    const randomDestinationId = getRandomInt(0, NUMBER_OF_DESTINATIONS);
    return (
      <div className={style.rootContainer}>
        <h1>Hvilken ovale weekend foretrekker herren?</h1>
        <div>Alle weekendz er torsdag til søndag</div>
        <div className={style.weekContainer}>
          {weeks.map((s, i) => (
            <a
              key={i}
              className={style.weekLinks}
              href={`/destination/${randomDestinationId}?startDate=${s.first.format(
                "YYYY-MM-DD"
              )}&endDate=${s.last.format("YYYY-MM-DD")}`}
            >
              {`${s.first.format("D.")} - ${s.last.format("D. MMMM")}`}
            </a>
          ))}
        </div>
      </div>
    );
  }
}

export default withRouter(App);
