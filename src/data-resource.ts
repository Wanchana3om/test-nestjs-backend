import 'reflect-metadata';
import { DataSource } from 'typeorm';
import 'dotenv/config';
import { UserEntity } from './entities/user.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: true,
  logging: false,
  entities: [UserEntity],
  migrations: ['./src/migration/*.ts'],
  subscribers: [],
});
