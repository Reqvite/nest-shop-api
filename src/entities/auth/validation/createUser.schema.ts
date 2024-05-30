import * as yup from 'yup';
import {nameMinMaxLength, passwordValidationSchema, phoneRegex} from '@/entities/auth/const/validation';

export const createUserSchema = yup.object().shape({
  firstName: nameMinMaxLength,
  lastName: nameMinMaxLength,
  email: yup.string().email().required(),
  password: passwordValidationSchema,
  phoneNumber: yup.string().matches(phoneRegex, 'Phone number must be exactly 12 digits').required()
});
