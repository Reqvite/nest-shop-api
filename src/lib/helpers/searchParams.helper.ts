import {ProductFilterKeys} from '@/types/product.interface';

const duplicateKeyRegex = /^(\w+)(\d+)$/;

export const decodeSearchParams = (searchParams: Record<string, any>): ProductFilterKeys => {
  const urlSearchParams = new URLSearchParams(searchParams);

  const decodedParams: Record<string, any> = {};

  [...urlSearchParams.entries()].forEach(([key, val]) => {
    const match = key.match(duplicateKeyRegex);
    if (match) {
      const [, baseKey, index] = match;
      if (!decodedParams[baseKey]) {
        decodedParams[baseKey] = [];
      }
      decodedParams[baseKey][parseInt(index)] = Number(val);
    } else {
      decodedParams[key] = Number(val);
    }
  });

  return decodedParams;
};
