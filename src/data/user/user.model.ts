import { Model } from '../base';

export interface User extends Model {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  isPasswordValid: (plainText: string) => Promise<Boolean>;
  updatePassword: (plainText: string) => Promise<User>;
}
