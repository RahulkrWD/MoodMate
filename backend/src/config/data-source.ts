import 'dotenv/config';
import { DataSource } from 'typeorm';

// Standalone DataSource used only by the TypeORM CLI (migration:generate / migration:run).
// The running app gets its config from typeorm.config.ts via @nestjs/config instead.
export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [__dirname + '/../modules/**/entities/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: false,
});
