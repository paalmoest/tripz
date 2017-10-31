export interface IData {
    destinations: IDestination[];
}

interface IStyling {
    coverImage: string;
    backgroundColor: string;
    backgroundImagePosition: string;
}

export interface IDestination {
    id: number;
    name: string;
    cityIATA: string;
    restaurants: IResturants[];
    accommodations: IPricing;
    food: IFood;
    drinks: IDrinks;
    styling: IStyling;
}

export interface IPricing {
    minPrice: number;
    maxPrice: number;
}

export interface IDrinks {
    beer: IPricing;
    cava: IPricing;
}
export interface IFood {
    dinner: IPricing;
}

export interface IResturants {
    id: number;
    name: string;
    address: string;
    website: string;
    description: string;
    gmapsLink: string;
}
export async function getDestinations() {
    const url = 'data';
    const response = await fetch(url);
    return <Promise<IData>>response.json();
}
