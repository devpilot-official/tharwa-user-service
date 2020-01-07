import HttpStatus from 'http-status-codes';

export class ControllerError extends Error {
  code: number;
  error_code: number;
  constructor(message: string) {
    super(message);
  }
}

export class ActionNotAllowedError extends ControllerError {
  constructor(message: string) {
    super(message);
    this.code = HttpStatus.BAD_REQUEST;
  }
}

export class NotFoundError extends ControllerError {
  constructor(message: string) {
    super(message);
    this.code = HttpStatus.NOT_FOUND;
  }
}
