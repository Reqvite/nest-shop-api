export const addFields = {
  $addFields: {
    discountedPrice: {$subtract: ['$price', {$multiply: ['$price', {$divide: ['$discount', 100]}]}]},
    sortQuantity: {
      $cond: {
        if: {$eq: ['$quantity', 0]},
        then: 1,
        else: 0
      }
    }
  }
};

export const minMaxPricesGroup = {
  $group: {
    _id: null,
    minPrice: {$min: '$discountedPrice'},
    maxPrice: {$max: '$discountedPrice'}
  }
};
