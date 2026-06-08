CREATE SCHEMA IF NOT EXISTS "main";
--> statement-breakpoint
CREATE TABLE "main"."admin" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar NOT NULL,
	"display_name" varchar(100) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"status" varchar(100) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar NOT NULL,
	"updated_by" varchar NOT NULL,
	CONSTRAINT "admin_email_unique" UNIQUE("email")
);
