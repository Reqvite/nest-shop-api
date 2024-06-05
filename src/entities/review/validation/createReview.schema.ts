import * as yup from 'yup';
import {yupValidation} from '@/const/validation.const';
import {messageValidation} from '../const/validation';

export const createReviewSchema = yup.object().shape({
  rating: yupValidation.getMinMaxNumber({min: 0, max: 5}),
  parentId: yupValidation.getObjectId({required: false}),
  productId: yupValidation.getObjectId(),
  message: messageValidation
});
