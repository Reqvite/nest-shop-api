import * as yup from 'yup';
import {yupValidation} from '@/const/validation.const';

export const createReviewSchema = yup.object().shape({
  parentId: yupValidation.getObjectId({required: false}),
  productId: yupValidation.getObjectId(),
  message: yupValidation.getMinMaxString({max: 100, min: 10})
});
