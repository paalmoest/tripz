export interface IData {
    destinations: IDestination[];
}

export interface IDestination {
    id: number;
    name: string;
    cityIATA: string;
    restaurants: IResturants[];
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
