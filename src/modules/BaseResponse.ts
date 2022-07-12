/* eslint-disable @typescript-eslint/no-explicit-any */
const BaseResponse = {
  success: (status: number, message: string, data?: any) => {
    return {
      status,
      success: true,
      message,
      data,
    };
  },
  failure: (status: number, message: string, data?: any) => {
    return {
      status,
      success: false,
      message,
      data,
    };
  },
};

export default BaseResponse;
