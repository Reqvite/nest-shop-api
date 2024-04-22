import * as yup from 'yup';

export const yupValidation = {
  getMinMaxString: ({min, max, required = true}: {min: number; max: number; required?: boolean}) =>
    required ? yup.string().min(min).max(max).required() : yup.string().min(min).max(max),
  getMinMaxNumber: ({min, max, required = true}: {min: number; max: number; required?: boolean}) =>
    required ? yup.number().min(min).max(max).required() : yup.string().min(min).max(max)
};
