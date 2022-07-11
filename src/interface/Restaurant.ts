// TODO 음식대처법은 hashtag쪽이야 아니면 category야....
interface IRestaurant {
  latitude: number;
  longitude: number;
  name: string;
  logo: string;
  category: string;
  hashtag: string[];
  address: string;
  worktime: string[];
  contact: string;
  reviews: string[];
  menus: string[];
}

export default IRestaurant;
