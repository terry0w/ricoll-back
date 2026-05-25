import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOneBy({ email });
  }

  findByNickname(nickname: string): Promise<User | null> {
    return this.userRepo.findOneBy({ nickname });
  }

  findByEmailOrNickname(identifier: string): Promise<User | null> {
    return this.userRepo
      .createQueryBuilder('u')
      .where('u.email = :id OR u.nickname = :id', { id: identifier })
      .getOne();
  }

  findByResetToken(token: string): Promise<User | null> {
    return this.userRepo.findOneBy({ resetPasswordToken: token });
  }

  findByVerificationToken(token: string): Promise<User | null> {
    return this.userRepo.findOneBy({ verificationToken: token });
  }

  save(user: User): Promise<User> {
    return this.userRepo.save(user);
  }

  async create(email: string, username: string, nickname: string, hashedPassword: string, verificationToken: string): Promise<User> {
    this.logger.log(`Creating user: ${email} (${nickname})`);
    const user = this.userRepo.create({ email, username, nickname, password: hashedPassword, verificationToken });
    return this.userRepo.save(user);
  }
}
