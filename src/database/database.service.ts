import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Scope,
} from '@nestjs/common';
import { ModelStatic } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { User } from 'src/user/entities/user.entity';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST })
export class DatabaseService {
  User: ModelStatic<User>;

  constructor(
    public readonly sequelize: Sequelize,
    @Inject(REQUEST) readonly request: Request,
  ) {
    Object.entries(this.sequelize.models).forEach(([key, model]) => {
      const tenantId = this.request.header('x-tenant-id');
      this[key] = model;
      this[key] = model.scope({
        method: ['tenant', tenantId],
      });
      this[key].removeHook('beforeCreate', 'autoSetTenantId');
      this[key].beforeCreate('autoSetTenantId', (model) => {
        if (!tenantId) {
          throw new HttpException(
            'BeforeCreate: Error: No tenantId',
            HttpStatus.BAD_REQUEST,
          );
        }
        model.tenantId = tenantId;
      });
    });
  }
}
