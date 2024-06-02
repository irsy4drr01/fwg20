import { JwtPayload } from "jsonwebtoken";
export interface IPayload extends JwtPayload {
  // jangan masukkan data sensitif
  uuid?: string;
  email?: string;
  //   name: string;
  //   age: number;
  //   address: string;
  role?: string;
}