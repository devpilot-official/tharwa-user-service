import joi from 'joi';

export const Login = {
  email: joi
    .string()
    .email()
    .lowercase()
    .required(),
  password: joi.string().required()
};

export const signup = {
  password: joi
    .string()
    .trim()
    .required(),
  first_name: joi
    .string()
    .trim()
    .lowercase()
    .required(),
  last_name: joi
    .string()
    .trim()
    .lowercase()
    .required(),
  email: joi
    .string()
    .email()
    .trim()
    .lowercase()
    .required()
};
