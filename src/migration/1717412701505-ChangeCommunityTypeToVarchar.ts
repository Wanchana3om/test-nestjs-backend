import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeCommunityTypeToVarchar1717412701505
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE posts ALTER COLUMN community_type TYPE varchar;',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE posts ALTER COLUMN community_type TYPE enum;',
    );
  }
}
