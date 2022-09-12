interface PrescriptionResponse {
  category: string[];
  prescription: {
    recommend: string[];
    tip: string[];
  };
}

export default PrescriptionResponse;
