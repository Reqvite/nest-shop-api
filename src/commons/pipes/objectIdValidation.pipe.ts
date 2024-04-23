import {Injectable, PipeTransform} from '@nestjs/common';
import * as mongoose from 'mongoose';
import {ErrorMessages} from '@/const/errors.const';
import {CustomErrors} from '@/utils/customErrors.utils';

@Injectable()
export class ObjectIdValidationPipe implements PipeTransform<string> {
  async transform(value: string) {
    const isValid = mongoose.Types.ObjectId.isValid(value);
    if (!isValid) {
      throw CustomErrors.BadRequestError(ErrorMessages.INVALID_OBJECT_ID);
    }
    return value;
  }
}
