import {ErrorMessages} from '@/const/errors.const';
import {decodeSearchParams} from '@/lib/helpers/searchParams.helper';
import {CustomErrors} from '@/services/customErrors.service';
import {ProductParamsI} from '@/types/product.interface';
import {ProductsQueryParamsSchemaType} from '../validation/getProductsQueryParams.schema';

const defaultPage = 1;
const defaultLimit = 10;
const minRating = 0;

export const getQueryParams = (params: ProductsQueryParamsSchemaType) => {
  const {page, limit, category, subCategory, rating, tags, search, price, brand} = decodeSearchParams(params);
  const pageIdx = page || defaultPage;
  const itemsLimit = limit || defaultLimit;
  const numberRating = rating;
  const skip = (pageIdx - 1) * itemsLimit;
  const query: ProductParamsI = {};

  try {
    if (brand && Array.isArray(brand)) query.brand = {$in: brand};
    if (tags && Array.isArray(tags)) query.tags = {$in: tags};
    if (category) query.category = category;
    if (subCategory) query.subCategory = subCategory;
    if (price && price[0] && price[1]) query.price = {$gte: price[0], $lt: price[1]};
    if (rating !== undefined) query.rating = {$gte: minRating, $lt: numberRating + 1};
    if (search) {
      const options = {$regex: search, $options: 'i'};
      query.$or = [
        {title: options},
        {brand: options},
        {'description.label': options},
        {'characteristics.label': options}
      ];
    }
  } catch (error) {
    console.log(error);
    throw CustomErrors.BadRequestError(ErrorMessages.INVALID_PARAMS);
  }

  return {query, skip, pageIdx, itemsLimit};
};
