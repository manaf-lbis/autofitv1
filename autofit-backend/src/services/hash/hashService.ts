import bcrypt from 'bcrypt';
import { IHashService } from './IHashService';

export class HashService  implements IHashService{

  async hash(data: string) {
    return await bcrypt.hash(data, Number(process.env.SALT_ROUNDS));
  }

  async compare(data: string, hashed: string) {
    return await bcrypt.compare(data, hashed);
  }
}