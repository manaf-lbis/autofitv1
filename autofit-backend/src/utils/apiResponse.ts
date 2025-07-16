// import { Response } from "express";
// import { HttpStatus } from "../types/responseCode";
// export enum StatusCode {
//     OK = 200,
//     CREATED = 201,
//     ACCEPTED = 202,
//     NO_CONTENT = 204
// }


// export const sendSuccess = (
//     res: Response,
//     message: string,
//     data: any = null,
//     statusCode: StatusCode = StatusCode.OK
//   ) => {
//     return res.status(statusCode).json({
//       status: "success",
//       message,
//       data,
//     });
// };


import { Response } from "express";
import { HttpStatus } from "../types/responseCode";
export enum StatusCode {
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NO_CONTENT = 204
}


export const sendSuccess = (
    res: Response,
    message: string,
    data: any = null,
    statusCode: HttpStatus = HttpStatus.OK
  ) => {
    return res.status(statusCode).json({
      status: "success",
      message,
      data,
    });
};