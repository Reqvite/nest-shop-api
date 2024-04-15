import {Injectable, PipeTransform} from '@nestjs/common';
import {Schema, ValidationError} from 'yup';
import {CustomErrors} from '@/utils/customErrors.utils';

@Injectable()
export class YupValidationPipe<T> implements PipeTransform<T> {
  constructor(private readonly schema: Schema<T>) {}

  async transform(value: T) {
    try {
      await this.schema.validate(value, {abortEarly: false});
    } catch (err) {
      if (err instanceof ValidationError) {
        throw CustomErrors.BadRequestError(err.errors.join(', '));
      } else {
        throw CustomErrors.BadRequestError();
      }
    }
    return value;
  }
}