import * as yup from 'yup';
import {yupValidation} from '@/const/validation.const';
import {messageValidation, ratingValidation} from '../const/validation';

export const createReviewSchema = yup.object().shape({
  parentId: yupValidation.getObjectId({required: false}),
  productId: yupValidation.getObjectId(),
  rating: ratingValidation(),
  message: messageValidation()
});
