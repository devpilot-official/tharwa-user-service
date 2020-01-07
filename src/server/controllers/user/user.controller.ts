import { Request, Response } from 'express';
import {
  httpPost,
  controller,
  request,
  response,
  requestBody,
  httpGet
} from 'inversify-express-utils';
import { BaseController } from '../base';
import validator from '@app/server/middlewares/validator';
import { Login, signup } from './user.validator';
import { LoginDTO, UserRepo, SignupDTO } from '@app/data/user';
import gateman from '@app/server/gateman';
import { AuthService } from '@app/server/services';

@controller('/user')
export default class UserController extends BaseController {
  /**
   * Gets a user's profile
   */
  @httpGet('/', gateman.guard())
  async getProfile(@request() req: Request, @response() res: Response) {
    try {
      this.handleSuccess(req, res, await UserRepo.byID(req.user));
    } catch (err) {
      this.handleError(req, res, err);
    }
  }

  /**
   * Creates a new user
   */
  @httpPost('/', validator(signup))
  async signup(
    @request() req: Request,
    @response() res: Response,
    @requestBody() body: SignupDTO
  ) {
    try {
      this.handleSuccess(req, res, await UserRepo.create(body));
    } catch (err) {
      this.handleError(req, res, err);
    }
  }

  /**
   * Logs in a user
   */
  @httpPost('/login', validator(Login))
  async login(
    @request() req: Request,
    @response() res: Response,
    @requestBody() body: LoginDTO
  ) {
    try {
      this.handleSuccess(req, res, await AuthService.login(body));
    } catch (err) {
      this.handleError(req, res, err);
    }
  }
}
