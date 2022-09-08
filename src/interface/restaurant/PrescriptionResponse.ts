interface PrescriptionResponse {
  category: string;
  prescription: {
    recommend: string[];
    tip: string[];
  } | null;
}

export default PrescriptionResponse;
