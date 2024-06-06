import {yupValidation} from '@/const/validation.const';

const messageValidation = ({required}: {required: boolean} = {required: true}) =>
  yupValidation.getMinMaxString({max: 100, min: 10, required});
const ratingValidation = ({required}: {required: boolean} = {required: true}) =>
  yupValidation.getMinMaxNumber({min: 0, max: 5, required});

export {messageValidation, ratingValidation};
