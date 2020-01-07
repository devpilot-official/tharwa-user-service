import jSend from 'jsend';

declare module 'express' {
  export interface Request {
    /**
     * Id of the user involved in the request
     */
    user: any;

    /**
     * Unique request id
     */
    id: string;
  }

  export interface Response {
    jSend: jSend;
  }

  /**
   * GenericRequest is an object that contains a unique id and the id of the user associated with a particular request.
   * It could optionally be an Express Request object.
   */
  export interface GenericRequest extends Partial<Request> {
    /**
     * Id of the user involved in the request
     */
    user: any;

    /**
     * Unique request id
     */
    id: string;
  }
}
