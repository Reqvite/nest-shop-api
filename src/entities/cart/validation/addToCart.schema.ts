import * as yup from 'yup';
import {yupValidation} from '@/const/validation.const';

export const addToCartSchema = yup.object().shape({
  _id: yupValidation.getObjectId(),
  quantity: yup.number().integer().positive().required()
});
