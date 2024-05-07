import * as yup from 'yup';
import {yupValidation} from '@/const/validation.const';
import {characteristicsValidation, minMaxTextLength, optionsValidation} from '../const/validation.const';

export const productSchema = yup.object().shape({
  image: yup.array().of(yup.string().url().required()).min(1).required(),
  title: minMaxTextLength,
  description: optionsValidation,
  brand: yupValidation.getMinMaxNumber({min: 1, max: 1000, required: false}),
  rating: yupValidation.getMinMaxNumber({min: 0, max: 5, required: false}),
  price: yup.number().positive().required(),
  discount: yupValidation.getMinMaxNumber({min: 0, max: 100, required: false}),
  quantity: yup.number().integer().min(0),
  category: yup.string().required(),
  subCategory: yup.number().required(),
  tags: yup.array().of(yup.number().required()).required(),
  characteristics: characteristicsValidation
});
