import mongoose from 'mongoose';
import * as yup from 'yup';

export const addToCartSchema = yup.object().shape({
  _id: yup
    .string()
    .test(
      'is-objectid',
      '${path} is not a valid ObjectId',
      (value) => value === undefined || mongoose.Types.ObjectId.isValid(value)
    ),
  quantity: yup.number().integer().positive().required()
});
