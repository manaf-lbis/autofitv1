import bcrypt from 'bcrypt';

export class HashService {

  async hash(data: string) {
    return await bcrypt.hash(data, 10);
  }

  async compare(data: string, hashed: string) {
    return await bcrypt.compare(data, hashed);
  }
}