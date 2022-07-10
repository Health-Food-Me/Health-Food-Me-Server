export interface IRestaurant {
  _id: string;
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
}
