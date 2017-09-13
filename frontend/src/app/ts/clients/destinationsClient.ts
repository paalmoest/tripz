
export interface IData {
  destinations: IDestination[];
}

export interface IDestination {
  id: number;
  name: string;
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
// tslint:disable-next-line:export-name
export async function getDestinations() {
  const url = 'data';
  const response = await fetch(url);
  return <Promise<IData>>response.json();
};