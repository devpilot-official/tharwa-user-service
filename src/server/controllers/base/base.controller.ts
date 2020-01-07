import { injectable } from 'inversify';
import { Response, Request } from 'express';
import HttpStatus from 'http-status-codes';
import _ from 'lodash';
import { DuplicateModelError, ModelNotFoundError } from '@app/data/base';
import logger from '@app/common/services/logger/logger';
import { IrisAPIError } from '@random-guys/iris';

@injectable()
export class BaseController {
  /*
   * Determines the HTTP status code of an error
   * @param err Error object
   */
  getHTTPErrorCode(err) {
    // check if error code exists and is a valid HTTP code.
    if (err.code >= 100 && err.code < 600) return err.code;

    if (err instanceof ModelNotFoundError) return HttpStatus.NOT_FOUND;
    if (err instanceof DuplicateModelError) return HttpStatus.BAD_REQUEST;
    return HttpStatus.BAD_REQUEST;
  }
  /**
   * Handles operation success and sends a HTTP response
   * @param req Express request
   * @param res Express response
   * @param data Success data
   */
  handleSuccess(req: Request, res: Response, data: any) {
    res.jSend.success(data);
    logger.logAPIResponse(req, res);
  }

  /**
   * Handles operation error, sends a HTTP response and logs the error.
   * @param req Express request
   * @param res Express response
   * @param error Error object
   * @param message Optional error message. Useful for hiding internal errors from clients.
   */
  handleError(
    req: Request,
    res: Response,
    err: Error | IrisAPIError,
    message?: string
  ) {
    /**
     * Useful when we call an asynchrous function that might throw
     * after we've sent a response to client
     */
    if (res.headersSent) return logger.error(err);

    const irisErrormessage =
      err instanceof IrisAPIError && err.data.message
        ? err.data.message
        : undefined;

    const errorMessage = message || (irisErrormessage || err.message);

    res.jSend.error(null, errorMessage, this.getHTTPErrorCode(err));
    logger.logAPIError(req, res, err);
  }

  getPaginationOptions(query: any) {
    return _.pick(query, ['page', 'per_page', 'projections', 'sort']);
  }
}
