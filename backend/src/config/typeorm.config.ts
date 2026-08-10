import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [__dirname + '/../modules/**/entities/*.entity{.ts,.js}'],
    autoLoadEntities: true,
    synchronize: false,
    migrationsRun: false,
    logging: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  }),
);
