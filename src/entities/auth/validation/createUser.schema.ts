import * as yup from 'yup';
import {nameMinMaxLength, passwordValidationSchema} from '@/entities/auth/const/validation';

export const createUserSchema = yup.object().shape({
  firstName: nameMinMaxLength,
  lastName: nameMinMaxLength,
  email: yup.string().email().required(),
  password: passwordValidationSchema,
  phoneNumber: yup.string()
});
