import mongoose from 'mongoose';
import * as yup from 'yup';

const objectIdValidation = yup
  .string()
  .test(
    'is-objectid',
    '${path} is not a valid ObjectId',
    (value) => value === undefined || mongoose.Types.ObjectId.isValid(value)
  );

export const yupValidation = {
  getMinMaxString: ({min, max, required = true}: {min: number; max: number; required?: boolean}) =>
    required ? yup.string().min(min).max(max).required() : yup.string().min(min).max(max),
  getMinMaxNumber: ({min, max, required = true}: {min: number; max: number; required?: boolean}) =>
    required ? yup.number().min(min).max(max).required() : yup.string().min(min).max(max),
  getIntegerPositive: ({min = 1, max = 1000000, required = true}: {min?: number; max?: number; required?: boolean}) =>
    required
      ? yup.number().min(min).min(max).integer().positive().required()
      : yup.number().min(min).min(max).integer().positive(),
  getObjectId: ({required = true}: {required?: boolean} = {}) =>
    required ? objectIdValidation.required() : objectIdValidation
};
