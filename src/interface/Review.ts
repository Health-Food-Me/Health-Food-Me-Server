interface Review {
  restaurantId: string;
  writerId: string;
  score: number;
  content: string;
  image: string[];
  reason: string[];
}

export default Review;
