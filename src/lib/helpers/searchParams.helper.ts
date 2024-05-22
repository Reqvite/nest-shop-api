import {ProductFilterKeys} from '@/types/product.interface';

const duplicateKeyRegex = /^(\w+)(\d+)$/;

export const decodeSearchParams = (searchParams: Record<string, any>): ProductFilterKeys => {
  const urlSearchParams = new URLSearchParams(searchParams);

  const decodedParams: Record<string, unknown> = {};

  [...urlSearchParams.entries()].forEach(([key, val]) => {
    const match = key.match(duplicateKeyRegex);
    if (match) {
      const [, baseKey, index] = match;
      if (!decodedParams[baseKey]) {
        decodedParams[baseKey] = [];
      }
      decodedParams[baseKey][parseInt(index)] = isNaN(Number(val)) ? val : Number(val);
    } else {
      decodedParams[key] = isNaN(Number(val)) ? val : Number(val);
    }
  });

  return decodedParams;
};
