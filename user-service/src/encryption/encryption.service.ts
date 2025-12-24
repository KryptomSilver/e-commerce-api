import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EncryptionService {
  async encryptValue(plaintValue: string) {
    const hashedValue = await bcrypt.hash(plaintValue, 12);
    return hashedValue;
  }
  async validateValue(hashedValue: string, plaintValue: string) {
    const isValid = await bcrypt.compare(plaintValue, hashedValue);
    return isValid;
  }
}
