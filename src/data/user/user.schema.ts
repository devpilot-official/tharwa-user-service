import Autopopulate from 'mongoose-autopopulate';
import bcrypt from 'bcrypt';
import { SchemaFactory, trimmedString, trimmedLowercaseString } from '../base';
import { User } from './user.model';
import env from '@app/common/config/env';

export const UserSchema = SchemaFactory({
  email: { ...trimmedLowercaseString, required: true, unique: true },
  first_name: { ...trimmedString, required: true },
  last_name: { ...trimmedString, required: true },
  password: {
    ...trimmedString,
    select: false
  }
}).plugin(Autopopulate);

/**
 * Mongoose Pre-save hook used to hash passwords for new users
 */
UserSchema.pre('save', async function() {
  const user = <User>this;
  if (!user.isNew || !user.password) return;

  const hash = await bcrypt.hash(user.password, env.salt_rounds);
  user.password = hash;
});

/**
 * Document method used to check if a plain text password is the same as a hashed password
 * @param plainText Plain text to be hashed and set as the paswword
 */
UserSchema.method('isPasswordValid', async function(plainText: string) {
  const user = <User>this;
  const result = await bcrypt.compare(plainText, user.password);
  return result;
});

/**
 * Document method used to change an user's password.
 * @param plainText Plain text to be hashed and set as the paswword
 */
UserSchema.method('updatePassword', async function(plainText: string) {
  const user = <User>this;
  const hash = await bcrypt.hash(plainText, env.salt_rounds);
  user.password = hash;
  return user.save();
});
