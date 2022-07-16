interface ReveiwResponseDto {
  restaurantId: string;
  writerId: string;
  score: number;
  hashtag: {
    taste: string;
    good: string[];
  };
  content: string;
  image: string[];
}

export default ReveiwResponseDto;
