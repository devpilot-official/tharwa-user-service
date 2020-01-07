import redis from '@app/common/services/redis';
import { ControllerError } from '@app/server/controllers/base';
import { LoginDTO, UserRepo } from '@app/data/user';
import gateman from '@app/server/gateman';

const DURATION_ONE_DAY = 60 * 60 * 24;

export const DAILY_FAILED_LOGIN_TRIES = 5;

const LOGIN_TRIES_KEY = 'user:login:tries';

const LOCKED_OUT_KEY = 'user:login:locked_out';

/**
 * Handles user authentication and login rate limiting
 */
class AuthService {
  /**
   * Gets the `login tries` within a day for an user from redis
   * @param id User's id
   */
  private async getLoginTries(id: string) {
    const key = `${LOGIN_TRIES_KEY}:${id}`;
    const loginTries = await redis.get(key);

    return Number(loginTries);
  }

  /**
   * Sets the `login tries` for an user and persists it for a day
   * @param id User's id
   * @param tries Current number of tries for the user. Defaults to `1`
   */
  private async setLoginTries(id: string, tries = 1) {
    const key = `${LOGIN_TRIES_KEY}:${id}`;
    await redis.set(key, tries, 'EX', DURATION_ONE_DAY);
  }

  /**
   * Returns the `locked out` status for an user from redis
   * @param user User's id
   */
  private async isAccountLocked(user: string) {
    const key = `${LOCKED_OUT_KEY}:${user}`;
    const lockedOutStatus = await redis.get(key);

    return !!lockedOutStatus;
  }

  /**
   * Sets the `locked out` status of an user to true and persists it for a day
   * @param id User's id
   */
  private async lockAccount(id: string) {
    const key = `${LOCKED_OUT_KEY}:${id}`;
    await redis.set(key, true, 'EX', DURATION_ONE_DAY);
  }

  /**
   * Increments an user's `login tries` limit and locks the user out if they reach the allowed daily limit
   * @param id User id
   */
  private async limit(id: string) {
    const loginTries = await this.getLoginTries(id);
    const updatedLoginTries = loginTries + 1;
    const remainingTries = DAILY_FAILED_LOGIN_TRIES - updatedLoginTries;

    if (updatedLoginTries === DAILY_FAILED_LOGIN_TRIES)
      await this.lockAccount(id);

    await this.setLoginTries(id, updatedLoginTries);

    throw new ControllerError(
      `Invalid password, you have ${remainingTries} attempt${
        remainingTries !== 1 ? 's' : ''
      } left`
    );
  }

  /**
   * Resets the locked out status and login limits for a user
   * @param id User's id
   */
  private async reset(id: string) {
    if (this.getLoginTries(id)) await redis.del(`${LOGIN_TRIES_KEY}:${id}`);

    if (this.isAccountLocked(id)) await redis.del(`${LOCKED_OUT_KEY}:${id}`);
  }

  /**
   * Validates that an user's login credentials are valid
   * @param body Payload for a login request
   */
  async login(body: LoginDTO) {
    const user = await UserRepo.byQuery(
      { email: body.email, status: 'active' },
      '+password'
    );

    const isLocked = await this.isAccountLocked(user.id);

    if (isLocked)
      throw new ControllerError(
        "You can't login because your account has been blocked, please contact customer support"
      );

    const isPasswordValid = await user.isPasswordValid(body.password);

    if (!isPasswordValid) return await this.limit(user.id);

    await this.reset(user.id);

    const token = await gateman.createSession({
      id: user.id,
      role: 'user'
    });

    return { user, token };
  }
}

export default new AuthService();
