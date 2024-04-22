import {SortOrder} from 'mongoose';
import {SortByEnum} from '@/enums/sortBy.enum';

export const getProductsSortBy = (sortValue: SortByEnum): {[key: string]: SortOrder} => {
  if (!sortValue) return {createdAt: -1};
  switch (sortValue) {
    case SortByEnum.PRICE_LOW_TO_HIGH:
      return {price: 1};
    case SortByEnum.PRICE_HIGH_TO_LOW:
      return {price: -1};
    case SortByEnum.RATING_LOW_TO_HIGHT:
      return {rating: 1};
    case SortByEnum.RATING_HIGH_TO_LOW:
      return {rating: -1};
  }
};
