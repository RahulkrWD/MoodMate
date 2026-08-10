import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1786332582958 implements MigrationInterface {
    name = 'InitSchema1786332582958'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "recommendations" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "mood_entry_id" uuid NOT NULL, "food_suggestion" text, "watch_suggestion" text, "activity_suggestion" text, "raw_ai_response" jsonb, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_ea3def533ef05b053a0597514dd" UNIQUE ("mood_entry_id"), CONSTRAINT "REL_ea3def533ef05b053a0597514d" UNIQUE ("mood_entry_id"), CONSTRAINT "PK_23a8d2db26db8cabb6ae9d6cd87" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "mood_entries" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "user_id" uuid, "mood" character varying(50) NOT NULL, "energy_level" character varying(20) NOT NULL, "dietary_pref" character varying(20), "time_available" character varying(30), "is_serious" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_535e463ec1fc30ee283f69f849c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" character varying(100) NOT NULL, "email" character varying(255) NOT NULL, "password_hash" text NOT NULL, "avatar_url" text, "is_verified" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "recommendations" ADD CONSTRAINT "FK_ea3def533ef05b053a0597514dd" FOREIGN KEY ("mood_entry_id") REFERENCES "mood_entries"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mood_entries" ADD CONSTRAINT "FK_8105931b79823bfc93b78614792" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mood_entries" DROP CONSTRAINT "FK_8105931b79823bfc93b78614792"`);
        await queryRunner.query(`ALTER TABLE "recommendations" DROP CONSTRAINT "FK_ea3def533ef05b053a0597514dd"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "mood_entries"`);
        await queryRunner.query(`DROP TABLE "recommendations"`);
    }

}
