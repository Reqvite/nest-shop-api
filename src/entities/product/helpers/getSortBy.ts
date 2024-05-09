import {SortOrder} from '@/enums/sortBy.enum';

export const getProductsSortBy = (orderBy: string, order: SortOrder): {[key: string]: SortOrder} => {
  if (!orderBy || !order) {
    return {createdAt: -1, _id: 1};
  }
  const sortCriteria: {[key: string]: SortOrder} = {
    [orderBy]: order,
    _id: 1
  };

  return sortCriteria;
};
