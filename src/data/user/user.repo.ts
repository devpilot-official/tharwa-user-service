import { BaseRepository } from '../base';
import { User } from './user.model';
import { UserSchema } from './user.schema';

class UserRepository extends BaseRepository<User> {
  constructor() {
    super('Admin', UserSchema);
  }
}

export const UserRepo = new UserRepository();
