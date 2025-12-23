import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { TokenService } from 'src/token/token.service';
import { EncryptionService } from 'src/encryption/encryption.service';
import { TokenDecoded } from 'src/token/interfaces/token-decoded.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject('NOTIFICATION_SERVICE')
    private readonly notificationService: ClientProxy,
    private readonly encryptionService: EncryptionService,
    private readonly tokenService: TokenService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    const encryptedPassword = await this.encryptionService.encryptValue(
      createUserDto.password,
    );
    createUserDto.password = encryptedPassword;
    const userValue = this.userRepository.create(createUserDto);
    await this.userRepository.save(userValue);
    this.notificationService.emit('user.created', {
      id: userValue.id,
      name: userValue.name,
      email: userValue.email,
    });
    const accessToken = await this.tokenService.generateAccessToken({
      userId: userValue.id,
    });
    const response = {
      user: {
        id: userValue.id,
        name: userValue.name,
        email: userValue.email,
      },
      accessToken,
    };
    return response;
  }
  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'name', 'email', 'password'],
    });
    if (!user) {
      throw new NotFoundException('Invalid credentials');
    }
    const isPasswordValid = await this.encryptionService.validateValue(
      user.password,
      password,
    );
    if (!isPasswordValid) {
      throw new NotFoundException('Invalid credentials');
    }
    const accessToken = await this.tokenService.generateAccessToken({
      userId: user.id,
    });
    const response = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      accessToken,
    };
    return response;
  }
  async getProfile(token: string) {
    try {
      const decodedToken = <TokenDecoded>(
        await this.tokenService.verfiyAccessToken(token)
      );
      return await this.userRepository.findOneBy({ id: decodedToken.userId });
    } catch (error) {
      throw new BadRequestException('Invalid token');
    }
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.userRepository.softDelete(id);
  }
}
