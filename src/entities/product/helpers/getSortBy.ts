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
    return {$sort: {createdAt: -1, _id: 1}};
  }

  if (orderBy === 'price') {
    return {$sort: {discountedPrice: order, _id: 1}};
  }

  const sortCriteria: SortCriteria = {
    [orderBy]: order,
    _id: 1
  };

  return {$sort: sortCriteria};
};
