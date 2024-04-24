import * as yup from 'yup';

export const yupValidation = {
  getMinMaxString: ({min, max, required = true}: {min: number; max: number; required?: boolean}) =>
    required ? yup.string().min(min).max(max).required() : yup.string().min(min).max(max),
  getMinMaxNumber: ({min, max, required = true}: {min: number; max: number; required?: boolean}) =>
    required ? yup.number().min(min).max(max).required() : yup.string().min(min).max(max),
  getIntegerPositive: ({min = 1, max = 1000000, required = true}: {min?: number; max?: number; required?: boolean}) =>
    required
      ? yup.number().min(min).min(max).integer().positive().required()
      : yup.number().min(min).min(max).integer().positive()
};
