import {
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { Optional } from 'sequelize';
import { BeforeFind, Column, Model, Scopes, Table } from 'sequelize-typescript';

interface UserAttributes {
  id: number;
  name: string;
}

type UserCreationAttributes = Optional<UserAttributes, 'id'>;

@Table
@Scopes(() => ({
  tenant: (tenantId) => ({
    where: { tenantId },
  }),
}))
export class User extends Model<UserAttributes, UserCreationAttributes> {
  id: string;

  @Column
  name: string;

  @Column
  tenantId: string;

  @BeforeFind({
    name: 'defaultBeforeFind',
  })
  static beforeFindHook(options: any): void {
    if (!options?.where?.tenantId && !options?.separate) {
      throw new HttpException(
        'BeforeFindHook: No tenantId',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
