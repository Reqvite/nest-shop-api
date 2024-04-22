import * as yup from 'yup';
import {integerPositive, ratingValue} from '../const/validation.const';

export const getProductsQueryParamsSchema = yup.object().shape({
  page: integerPositive,
  limit: yup.number().min(1).max(20).integer().positive(),
  category: integerPositive,
  subCategory: integerPositive,
  rating: ratingValue,
  tags: yup.string(),
  sortBy: yup.number().min(0).integer().positive(),
  search: yup.string()
});

export type ProductsQueryParamsSchemaType = yup.InferType<typeof getProductsQueryParamsSchema>;
