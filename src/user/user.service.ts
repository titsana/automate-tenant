import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly databaseService: DatabaseService, // private readonly sequelize: Sequelize,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.databaseService.User.create(createUserDto);
  }

  findAll() {
    return this.databaseService.User.findAll();
  }

  findOne(id: number) {
    return this.databaseService.User.findOne({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.databaseService.User.update(updateUserDto, { where: { id } });
    return this.findOne(id);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    await user.destroy();
    return user;
  }
}
