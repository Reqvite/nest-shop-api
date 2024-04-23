import * as yup from 'yup';
import {yupValidation} from '@/const/validation.const';
import {integerPositive} from '../const/validation.const';

export const getProductsQueryParamsSchema = yup.object().shape({
  page: integerPositive,
  limit: yup.number().min(1).max(20).integer().positive(),
  category: integerPositive,
  subCategory: integerPositive,
  rating: yupValidation.getMinMaxNumber({min: 0, max: 5, required: false}),
  tags: yup.number(),
  sortBy: yupValidation.getIntegerPositive({min: 0, required: false}),
  search: yup.string()
});

export type ProductsQueryParamsSchemaType = yup.InferType<typeof getProductsQueryParamsSchema>;
