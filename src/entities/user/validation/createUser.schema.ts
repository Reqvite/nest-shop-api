import * as yup from 'yup';
import {ErrorMessages} from '@/const/errors.const';

const passwordComplexity = yup
  .string()
  .min(3, ErrorMessages.MIN_LENGTH({length: 3, label: 'Password'}))
  .matches(
    /^(?=.*[a-z].*[a-z])(?=.*[A-Z].*[A-Z])(?=.*\d.*\d)(?=.*[^a-zA-Z0-9].*[^a-zA-Z0-9]).*$/,
    'Password must contain at least 2 lowercase, 2 uppercase, 2 digits, and 2 special characters'
  )
  .required();

export const createUserSchema = yup.object().shape({
  firstName: yup.string().min(3).max(30).required(),
  lastName: yup.string().min(3).max(30).required(),
  email: yup.string().email().required(),
  password: passwordComplexity,
  phoneNumber: yup
    .string()
    .matches(/^[0-9]{12}$/, ErrorMessages.INVALID_PHONE_FORMAT())
    .required()
});
