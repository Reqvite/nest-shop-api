import * as yup from 'yup';

const minMaxTextLength = yup.string().min(3).max(30).required();
const descriptionValue = yup.string().min(3).max(300).required();
const optionsValidation = yup.array().of(
  yup
    .object()
    .shape({
      label: minMaxTextLength,
      value: descriptionValue
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

export {characteristicsValidation, minMaxTextLength, optionsValidation};
