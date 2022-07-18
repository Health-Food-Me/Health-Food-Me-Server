"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const BaseResponse = {
    success: (status, message, data) => {
        return {
            status,
            success: true,
            message,
            data,
        };
    },
    failure: (status, message, data) => {
        return {
            status,
            success: false,
            message,
            data,
        };
    },
};
exports.default = BaseResponse;
//# sourceMappingURL=BaseResponse.js.map