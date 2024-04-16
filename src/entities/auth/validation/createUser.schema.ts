import * as yup from 'yup';
import {ErrorMessages} from '@/const/errors.const';
import {nameMinMaxLength, passwordValidationSchema, phoneRegex} from '@/entities/auth/const/validation';

export const createUserSchema = yup.object().shape({
  firstName: nameMinMaxLength,
  lastName: nameMinMaxLength,
  email: yup.string().email().required(),
  password: passwordValidationSchema,
  phoneNumber: yup.string().matches(phoneRegex, ErrorMessages.INVALID_PHONE_FORMAT()).required()
});
