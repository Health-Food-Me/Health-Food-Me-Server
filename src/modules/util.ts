/* eslint-disable @typescript-eslint/no-explicit-any */
const util = {
  success: (status: number, message: string, data?: any) => {
    return {
      status,
      success: true,
      message,
      data,
    };
  },
  fail: (status: number, message: string, data?: any) => {
    return {
      status,
      success: false,
      message,
      data,
    };
  },
};

export default util;
