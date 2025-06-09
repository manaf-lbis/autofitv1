export interface ApiError  {
    status: number;
    data: {
      status: string;
      message: string;
    };
}