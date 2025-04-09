export type ApiError = {
    status: number;
    data: {
      status: string;
      message: string;
    };
}