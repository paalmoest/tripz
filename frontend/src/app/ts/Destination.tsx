import * as moment from 'moment';
import 'moment/locale/nb';
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
moment.locale('nb');
function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatNOK(amountInNok: string) {
    let stripped = amountInNok.slice(3);
    return formatMoneyString(stripped);
}
function formatMoneyString(amount: string) {
    let i = amount.length;
    while (i > 3) {
        amount = amount.slice(0, i - 3) + ' ' + amount.slice(i - 3);
        i = i - 3;
    }
    return `${amount} kr`;
}

function formatMoneyNumber(amount: number) {
    return formatMoneyString(`${amount}`);
}

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
        const id = parseInt(this.props.params.id, 10);
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
            },
        };
        return (
            <div className={style.rootContainer}>
                <div className={style.internalContainer}>
                    <header
                        className={style.headerSection}
                        style={{
                            backgroundImage: `url(https://s3.eu-central-1.amazonaws.com/ovalweekend/${destination
                                .styling.coverImage}`,
                            backgroundPosition: destination.styling.backgroundImagePosition,
                        }}
                    >
                        <h1>{destination.name}</h1>
                        <p className={style.date}>{`${moment(startDate).format('dddd Do MMMM')}`}</p>
                    </header>
                    <section
                        className={style.priceSection}
                        style={{ backgroundColor: destination.styling.backgroundColor }}
                    >
                        <div className={style.flightsContainer}>
                            {trips.map((x, index) => (
                                <div key={index} className={style.flightTripItem}>
                                    <div>
                                        <span>
                                            {moment(x.departrueTime).format('HH:mm')} -{' '}
                                            {moment(x.arrivalTime).format('HH:mm')}
                                        </span>
                                        {` (${Math.floor(x.duration / 60)} t ${x.duration % 60} m)`}
                                    </div>
                                    <div>
                                        {x.airports[1].name} {x.airports[1].code}
                                    </div>
                                    <div>{formatNOK(x.price)}</div>
                                    <div className={style.carrier}>{x.carrier}</div>
                                </div>
                            ))}
                        </div>
                        <div className={style.priceInfoContainer}>
                            <div>
                                Hotellpriser {formatMoneyNumber(destination.accommodations.minPrice)} -{' '}
                                {formatMoneyNumber(destination.accommodations.maxPrice)}
                            </div>
                            <div>
                                Middagspriser {formatMoneyNumber(destination.food.dinner.minPrice)} -{' '}
                                {formatMoneyNumber(destination.food.dinner.maxPrice)}
                            </div>
                            <div>
                                Øl {formatMoneyNumber(destination.drinks.beer.minPrice)} -{' '}
                                {formatMoneyNumber(destination.drinks.beer.maxPrice)}
                            </div>
                            <div>
                                Chill flaske Cava {formatMoneyNumber(destination.drinks.cava.minPrice)} -{' '}
                                {formatMoneyNumber(destination.drinks.cava.maxPrice)}
                            </div>
                        </div>
                    </section>
                    <section className={style.thingsToDoSection}>
                        <h2 className={style.thingsToDoSectionTitle}>Ting å gjøre</h2>
                        <div>
                            {destination.restaurants.map(x => (
                                <div key={x.id} className={style.restaurantItem}>
                                    {x.name}
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
                <Link to={to} className={style.changeDestination}>
                    GI MÆ NO AINNA
                </Link>
            </div>
        );
    }
}
export default withRouter(Destination);
