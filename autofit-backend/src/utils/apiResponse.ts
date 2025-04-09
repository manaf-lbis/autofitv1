import { Response } from "express";

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
    statusCode: StatusCode = StatusCode.OK
  ) => {
    return res.status(statusCode).json({
      status: "success",
      message,
      data,
    });
};