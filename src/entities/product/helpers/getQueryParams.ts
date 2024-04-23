import {ProductParamsI} from '@/types/product.interface';
import {CustomErrors} from '@/utils/customErrors.utils';
import {ProductsQueryParamsSchemaType} from '../validation/getProductsQueryParams.schema';

export const getQueryParams = ({
  page,
  limit,
  category,
  subCategory,
  rating,
  tags,
  search
}: ProductsQueryParamsSchemaType) => {
  const pageIdx = Number(page) || 1;
  const itemsLimit = Number(limit) || 10;
  const numberRating = Number(rating);
  const skip = (pageIdx - 1) * itemsLimit;
  const query: ProductParamsI = {};

  try {
    if (category) query.category = category;
    if (subCategory) query.subCategory = subCategory;
    if (rating) query.rating = {$gte: numberRating, $lt: numberRating + 1};
    if (tags && Array.isArray(JSON.parse(tags))) {
      query.tags = {$in: JSON.parse(tags)};
    }
    if (search) {
      query.$or = [
        {title: {$regex: search, $options: 'i'}},
        {brand: {$regex: search, $options: 'i'}},
        {'description.label': {$regex: search, $options: 'i'}},
        {'characteristics.label': {$regex: search, $options: 'i'}}
      ];
    }
  } catch (error) {
    throw CustomErrors.BadRequestError();
  }

  return {query, skip, pageIdx, itemsLimit};
};
