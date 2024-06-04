import {yupValidation} from '@/const/validation.const';

const messageValidation = yupValidation.getMinMaxString({max: 100, min: 10});

export {messageValidation};
