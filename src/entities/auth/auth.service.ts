import {Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {InjectModel} from '@nestjs/mongoose';
import {compare, genSaltSync, hashSync} from 'bcryptjs';
import {Model, Schema} from 'mongoose';
import {ACCESS_TOKEN_EXPIRED_TIME, REFRESH_TOKEN_EXPIRED_TIME} from '@/const/jwt.const';
import {TokensI} from '@/types/jwt.interface';
import {ErrorMessages} from '../../const/errors.const';
import {CustomErrors} from '../../services/customErrors.service';
import {createUserDto} from './dto/createUser.dto';
import {UserResponseDto} from './dto/userResponse.dto';
import {User} from './model/user.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly jwtService: JwtService
  ) {}

  async register(dto: createUserDto): Promise<TokensI> {
    const isUserExist = await this.userModel.findOne({email: dto.email});
    if (isUserExist) {
      throw CustomErrors.ConflictError(ErrorMessages.USER_ALREADY_EXISTS);
    }
    const newUser = new this.userModel({
      ...dto,
      password: await this.hashData(dto.password)
    });
    const user = await newUser.save();
    const tokens = await this.getTokens(user);
    await this.updateRefreshToken(newUser._id, tokens.refreshToken);

    return tokens;
  }

  async login(user: User) {
    const tokens = await this.getTokens(user);
    await this.updateRefreshToken(user._id, tokens.refreshToken);

    return {user: new UserResponseDto(user), tokens};
  }

  async currentUser(_id: Schema.Types.ObjectId): Promise<UserResponseDto> {
    return new UserResponseDto(await this.userModel.findOne({_id}));
  }

  async logout(userId: Schema.Types.ObjectId): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {refreshToken: null});
  }

  async refreshTokens(userId: Schema.Types.ObjectId, refreshToken: string): Promise<TokensI> {
    const user = await this.userModel.findOne({_id: userId});
    if (!user || !user.refreshToken) {
      throw CustomErrors.AuthorizationError(ErrorMessages.UNAUTHORIZED);
    }
    const isValidRefreshToken = await compare(refreshToken, user.refreshToken);
    if (!isValidRefreshToken) {
      throw CustomErrors.AuthorizationError(ErrorMessages.UNAUTHORIZED);
    }

    const tokens = await this.getTokens(user);
    await this.updateRefreshToken(user._id, tokens.refreshToken);

    return tokens;
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

  async getTokens(user: User): Promise<TokensI> {
    const payload = {_id: user._id, roles: user.roles};
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: ACCESS_TOKEN_EXPIRED_TIME
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: REFRESH_TOKEN_EXPIRED_TIME
      })
    ]);

    return {
      accessToken,
      refreshToken
    };
  }

  async hashData(data: string): Promise<string> {
    return hashSync(data, genSaltSync(10));
  }

  async updateRefreshToken(userId: Schema.Types.ObjectId, refreshToken: string) {
    const hash = await this.hashData(refreshToken);
    await this.userModel.findByIdAndUpdate(userId, {refreshToken: hash});
  }
}
