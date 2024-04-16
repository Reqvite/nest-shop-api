import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {genSaltSync, hashSync} from 'bcryptjs';
import {Model} from 'mongoose';
import {ErrorMessages} from '../../const/errors.const';
import {CustomErrors} from '../../utils/customErrors.utils';
import {createUserDto} from './dto/createUser.dto';
import {User} from './model/user.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>
  ) {}

  async register(dto: createUserDto): Promise<User> {
    const isUserExist = await this.userModel.findOne({email: dto.email});
    if (isUserExist) {
      throw CustomErrors.ConflictError(ErrorMessages.USER_ALREADY_EXISTS);
    }
    const newUser = new this.userModel({
      ...dto,
      password: hashSync(dto.password, genSaltSync(10))
    });

    return await newUser.save();
  }
}
