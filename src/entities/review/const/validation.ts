import {yupValidation} from '@/const/validation.const';

const messageValidation = yupValidation.getMinMaxString({max: 300, min: 10});
const ratingValidation = yupValidation.getMinMaxNumber({min: 0, max: 5});

export {messageValidation, ratingValidation};
