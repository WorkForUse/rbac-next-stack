import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PermissionsModule } from './permissions/permissions.module';
import { User } from './users/entities/user.entity';
import { Permission } from './permissions/entities/permission.entity';
import { Role } from './roles/entities/role.entity';
import { AuditLog } from './audit-logs/entities/audit-log.entity';
import { AuditModule } from './audit-logs/audit.module';
import { LeadsModule } from './leads/leads.module';
import { Lead } from './leads/entities/lead.entity';
import { RolesModule } from './roles/roles.module';
import { TasksModule } from './tasks/tasks.module';
import { ReportsModule } from './reports/reports.module';
import { Task } from './tasks/entities/task.entity';
import { Report } from './reports/entities/report.entity';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 60000,
        limit: 10,
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: parseInt(configService.get<string>('DB_PORT'), 10),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_NAME'),
    entities: [User, Permission, Role, AuditLog, Lead, Task, Report],
    synchronize: configService.get<string>('NODE_ENV') !== 'production',
  }),
}),
    AuthModule,
    UsersModule,
    PermissionsModule,
    AuditModule,
    LeadsModule,
    RolesModule,
    TasksModule,
    ReportsModule,
  ],
})
export class AppModule {}