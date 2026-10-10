ALTER TABLE "public"."courses"
  ADD COLUMN "position" integer NOT NULL DEFAULT 0;

ALTER TABLE "public"."courses"
  ADD CONSTRAINT "courses_position_check" CHECK (("position" >= 0));

