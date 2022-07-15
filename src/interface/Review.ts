interface Review {
  restaurantId: string;
  writerId: string;
  score: number;
  content: string;
  image: string[];
  reason: {
    taste: string;
    good: string[];
  };
}

export default Review;
