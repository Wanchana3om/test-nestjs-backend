import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeCommunityTypeToEnum1717414802606
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Define enum values
    const enumValues = [
      'History',
      'Food',
      'Pets',
      'Health',
      'Fashion',
      'Exercise',
      'Others',
    ];

    await queryRunner.query(
      `CREATE TYPE enum_community_type AS ENUM ('${enumValues.join("', '")}')`,
    );

    await queryRunner.query(
      `ALTER TABLE "posts" ALTER COLUMN "community_type" TYPE enum_community_type USING community_type::enum_community_type`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "posts" ALTER COLUMN "community_type" TYPE VARCHAR`,
    );

    await queryRunner.query(`DROP TYPE enum_community_type`);
  }
}
