interface AroundRestaurantDto {
  _id: string;
  name: string;
  longitude: number | undefined;
  latitude: number | undefined;
  isDietRestaurant: boolean;
}

export default AroundRestaurantDto;
