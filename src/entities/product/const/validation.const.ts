import * as yup from 'yup';
import {yupValidation} from '@/const/validation.const';

const integerPositive = yupValidation.getIntegerPositive({required: false});
const minMaxTextLength = yupValidation.getMinMaxString({min: 3, max: 30});
const optionsValidation = yup.array().of(
  yup
    .object()
    .shape({
      label: minMaxTextLength,
      value: yupValidation.getMinMaxString({min: 3, max: 300})
    })
    .required()
);
const characteristicsValidation = yup.array().of(
  yup
    .object()
    .shape({
      label: minMaxTextLength,
      value: minMaxTextLength
    })
    .required()
);

export {characteristicsValidation, integerPositive, minMaxTextLength, optionsValidation};
