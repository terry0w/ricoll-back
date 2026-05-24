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

  async create(email: string, username: string, hashedPassword: string): Promise<User> {
    this.logger.log(`Creating user: ${email}`);
    const user = this.userRepo.create({ email, username, password: hashedPassword });
    return this.userRepo.save(user);
  }
}
