export const discountedPriceAddField = {
  $addFields: {
    discountedPrice: {$subtract: ['$price', {$multiply: ['$price', {$divide: ['$discount', 100]}]}]}
  }
};

export const minMaxPricesGroup = {
  $group: {
    _id: null,
    minPrice: {$min: '$discountedPrice'},
    maxPrice: {$max: '$discountedPrice'}
  }
};
