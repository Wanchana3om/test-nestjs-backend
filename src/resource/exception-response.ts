export interface ErrorResponseInterface {
  status: { code: number; message: string };
  error: { code: number; message: string; errors: string[] };
}
