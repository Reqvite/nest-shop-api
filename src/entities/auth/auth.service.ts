import {Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {InjectModel} from '@nestjs/mongoose';
import {compare, genSaltSync, hashSync} from 'bcryptjs';
import {Model} from 'mongoose';
import {JwtI} from '@/types/jwt.interface';
import {ErrorMessages} from '../../const/errors.const';
import {CustomErrors} from '../../utils/customErrors.utils';
import {createUserDto} from './dto/createUser.dto';
import {User} from './model/user.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly jwtService: JwtService
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

  async validateUser({email, password}: {email: string; password: string}): Promise<User> {
    const user = await this.userModel.findOne({email});
    if (!user) {
      throw CustomErrors.AuthorizationError(ErrorMessages.INVALID_CREDENTIALS);
    }
    const isCorrectPassword = await compare(password, user.password);
    if (!isCorrectPassword) {
      throw CustomErrors.AuthorizationError(ErrorMessages.INVALID_CREDENTIALS);
    }

    return user;
  }

  async login(user: User): Promise<JwtI> {
    const payload = {_id: user._id};

    return {
      accessToken: await this.jwtService.signAsync(payload)
    };
  }
}
