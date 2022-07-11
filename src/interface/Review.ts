interface IReview {
  restaurantId: string;
  writerId: string;
  score: number;
  content: string;
  image: string[];
  reason: string[];
}

export default IReview;
