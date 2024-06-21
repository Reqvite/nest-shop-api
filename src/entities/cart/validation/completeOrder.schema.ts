import * as yup from 'yup';
import {
  addressValidation,
  cityValidation,
  countryValidation,
  emailValidation,
  firstNameValidation,
  iso3Validation,
  lastNameValidation,
  notesValidation,
  phoneNumberValidation,
  privacyPolicyAgreementValidation,
  zipValidation
} from '../const/validation.const';
import {addToCartSchema} from './addToCart.schema';

export const orderInformationSchema = yup.object().shape({
  firstName: firstNameValidation,
  lastName: lastNameValidation,
  email: emailValidation,
  address: addressValidation,
  phoneNumber: phoneNumberValidation,
  iso3: iso3Validation,
  country: countryValidation,
  city: cityValidation,
  zip: zipValidation,
  notes: notesValidation,
  privacyPolicyAgreement: privacyPolicyAgreementValidation,
  newsLatterAgreement: yup.boolean()
});

export const completeOrderSchema = yup.object().shape({
  products: yup.array().of(addToCartSchema).min(1).required(),
  orderInformation: orderInformationSchema,
  totalPrice: yup.number().positive().required()
});
