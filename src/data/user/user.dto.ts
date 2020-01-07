/**
 * Payload sent for a login request
 */
export interface LoginDTO {
  email: string;
  password: string;
}

export interface SignupDTO {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}
