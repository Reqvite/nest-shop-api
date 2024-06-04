import * as yup from 'yup';
import {yupValidation} from '@/const/validation.const';
import {messageValidation} from '../const/validation';

export const updateReviewSchema = yup.object().shape({
  _id: yupValidation.getObjectId(),
  message: messageValidation
});
