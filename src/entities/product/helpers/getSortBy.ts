import {SortOrder} from '@/enums/sortBy.enum';

type SortCriteria = {
  [key: string]: SortOrder;
  _id: number;
};

type ProductsSortByResult = {
  $sort: SortCriteria;
};

export const getProductsSortBy = (orderBy: string, order: SortOrder): ProductsSortByResult => {
  if (!orderBy || !order) {
    return {$sort: {sortQuantity: 1, createdAt: -1, _id: 1}};
  }

  if (orderBy === 'price') {
    return {$sort: {sortQuantity: 1, discountedPrice: order, _id: 1}};
  }

  const sortCriteria: SortCriteria = {
    sortQuantity: 1,
    [orderBy]: order,
    _id: 1
  };

  return {$sort: sortCriteria};
};
