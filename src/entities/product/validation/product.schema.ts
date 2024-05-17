import * as yup from 'yup';
import {yupValidation} from '@/const/validation.const';
import {characteristicsValidation, minMaxTextLength, optionsValidation} from '../const/validation.const';

const imgValidation = yup.object().shape({
  src: yup.string().url().required()
});

export const productSchema = yup.object().shape({
  images: yup.array().of(imgValidation).min(1).required(),
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
