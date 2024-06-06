import * as yup from 'yup';
import {yupValidation} from '@/const/validation.const';
import {messageValidation, ratingValidation} from '../const/validation';

export const updateReviewSchema = yup.object().shape({
  _id: yupValidation.getObjectId(),
  rating: ratingValidation({required: false}),
  message: messageValidation({required: false})
});
