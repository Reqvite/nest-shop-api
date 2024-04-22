import * as yup from 'yup';
import {characteristicsValidation, minMaxTextLength, optionsValidation} from '../const/validation.const';

export const productSchema = yup.object().shape({
  image: yup.array().of(yup.string().url().required()).min(1).required(),
  title: minMaxTextLength,
  description: optionsValidation,
  brand: minMaxTextLength,
  rating: yup.number().min(0).max(5),
  price: yup.number().positive().required(),
  discount: yup.number().min(0).max(100),
  quantity: yup.number().integer().min(0),
  category: yup.string().required(),
  subCategory: yup.number().required(),
  tags: yup.array().of(yup.number().required()).required(),
  characteristics: characteristicsValidation
});
