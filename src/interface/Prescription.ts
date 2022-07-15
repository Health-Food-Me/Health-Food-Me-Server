interface Prescription {
  category: string;
  content: {
    recommend: string[];
    eating: string[];
  };
}

export default Prescription;
