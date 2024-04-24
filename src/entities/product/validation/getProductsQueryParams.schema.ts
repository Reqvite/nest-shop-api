import * as yup from 'yup';
import {yupValidation} from '@/const/validation.const';

export const getProductsQueryParamsSchema = yup.object().shape({
  page: yupValidation.getIntegerPositive({required: false}),
  limit: yupValidation.getIntegerPositive({min: 1, max: 20, required: false}),
  category: yupValidation.getIntegerPositive({required: false}),
  subCategory: yupValidation.getIntegerPositive({required: false}),
  rating: yupValidation.getMinMaxNumber({min: 0, max: 5, required: false}),
  tags: yup.string(),
  orderBy: yup.string(),
  order: yup.number().oneOf([1, -1]),
  search: yup.string()
});

export type ProductsQueryParamsSchemaType = yup.InferType<typeof getProductsQueryParamsSchema>;
