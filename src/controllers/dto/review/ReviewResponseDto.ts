interface ReveiwResponseDto {
  restaurantId: string;
  writerId: string;
  reviewId: string;
  score: number;
  taste: string;
  good: string[];
  content: string;
  image: {
    name: string;
    url: string;
  }[];
  nameList: string[];
}

export default ReveiwResponseDto;
