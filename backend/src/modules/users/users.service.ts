import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  // Excludes passwordHash - every caller of findById only needs profile
  // fields. Login goes through findByEmail instead, which does need it
  // for the bcrypt comparison.
  findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'avatarUrl', 'isVerified', 'createdAt'],
    });
  }

  create(data: {
    name: string;
    email: string;
    passwordHash: string;
  }): Promise<User> {
    const user = this.usersRepository.create(data);
    return this.usersRepository.save(user);
  }

  async markVerified(id: string): Promise<void> {
    await this.usersRepository.update(id, { isVerified: true });
  }

  async updatePassword(id: string, passwordHash: string): Promise<void> {
    await this.usersRepository.update(id, { passwordHash });
  }

  async updateProfile(
    id: string,
    data: Partial<Pick<User, 'name' | 'avatarUrl'>>,
  ): Promise<User> {
    await this.usersRepository.update(id, data);
    return (await this.findById(id))!;
  }
}
