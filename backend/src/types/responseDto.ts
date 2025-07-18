export type Res<T> = {
  success: boolean;
  message: string;
  data?: T;
};
