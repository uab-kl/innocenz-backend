CREATE TYPE "main"."audit_action" AS ENUM('CREATE', 'UPDATE', 'DELETE', 'BULK_CREATE', 'BULK_UPDATE', 'BULK_DELETE', 'CREATE_FAILED', 'UPDATE_FAILED', 'DELETE_FAILED', 'BULK_CREATE_FAILED', 'BULK_UPDATE_FAILED', 'BULK_DELETE_FAILED');--> statement-breakpoint
CREATE TABLE "main"."admin_role" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"admin_id" uuid NOT NULL,
	"role_id" uuid NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar NOT NULL,
	"updated_by" varchar NOT NULL,
	CONSTRAINT "admin_role_admin_id_role_id_unique" UNIQUE("admin_id","role_id")
);
--> statement-breakpoint
CREATE TABLE "main"."audit_logs" (
	"audit_log_id" bigserial PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"role" text,
	"action" text NOT NULL,
	"entity" text NOT NULL,
	"entity_id" text,
	"batch_id" uuid,
	"old_data" jsonb,
	"new_data" jsonb,
	"ip_address" "inet" NOT NULL,
	"user_agent" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "main"."agency_user" (
	"agency_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar NOT NULL,
	"updated_by" varchar NOT NULL,
	CONSTRAINT "agency_user_agency_id_user_id_pk" PRIMARY KEY("agency_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "main"."m_agency" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"agency_name" varchar(100) NOT NULL,
	"agency_address" varchar(255) NOT NULL,
	"agency_contact_no" varchar(20) NOT NULL,
	"agency_email" varchar(100) NOT NULL,
	"agency_logo" varchar(255) NOT NULL,
	"agency_status" varchar(20) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar NOT NULL,
	"updated_by" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "main"."m_module" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"module_name" varchar NOT NULL,
	"status" varchar NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar NOT NULL,
	"updated_by" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "main"."outlet_owner" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar NOT NULL,
	"updated_by" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "main"."m_outlet" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"outlet_owner_id" uuid NOT NULL,
	"outlet_name" varchar(100) NOT NULL,
	"outlet_address" varchar(255) NOT NULL,
	"outlet_contact_no" varchar(20) NOT NULL,
	"outlet_email" varchar(100) NOT NULL,
	"outlet_logo" varchar(255) NOT NULL,
	"status" varchar(20) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar NOT NULL,
	"updated_by" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "main"."m_permission" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"module_id" uuid NOT NULL,
	"permission_name" varchar NOT NULL,
	"description" varchar NOT NULL,
	"status" varchar NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar NOT NULL,
	"updated_by" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "main"."m_pr" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"ic_no" varchar(20) NOT NULL,
	"pr_no" varchar(20) NOT NULL,
	"pr_agency" uuid NOT NULL,
	"comcard_images" jsonb NOT NULL,
	"language" text[] DEFAULT '{}' NOT NULL,
	"bwh_measurements" jsonb NOT NULL,
	"status" varchar(20) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar NOT NULL,
	"updated_by" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "main"."role" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"role_name" varchar NOT NULL,
	"status" varchar NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar NOT NULL,
	"updated_by" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "main"."role_permission" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"role_id" uuid NOT NULL,
	"permission_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar NOT NULL,
	"updated_by" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "main"."user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar NOT NULL,
	"profile_image" varchar,
	"acc_name" varchar(100) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"contact_no" varchar(20) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar NOT NULL,
	"updated_by" varchar NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "main"."admin_role" ADD CONSTRAINT "admin_role_admin_id_admin_id_fk" FOREIGN KEY ("admin_id") REFERENCES "main"."admin"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "main"."admin_role" ADD CONSTRAINT "admin_role_role_id_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "main"."role"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "main"."agency_user" ADD CONSTRAINT "agency_user_agency_id_m_agency_id_fk" FOREIGN KEY ("agency_id") REFERENCES "main"."m_agency"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "main"."agency_user" ADD CONSTRAINT "agency_user_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "main"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "main"."outlet_owner" ADD CONSTRAINT "outlet_owner_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "main"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "main"."m_outlet" ADD CONSTRAINT "m_outlet_outlet_owner_id_outlet_owner_id_fk" FOREIGN KEY ("outlet_owner_id") REFERENCES "main"."outlet_owner"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "main"."m_permission" ADD CONSTRAINT "m_permission_module_id_m_module_id_fk" FOREIGN KEY ("module_id") REFERENCES "main"."m_module"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "main"."m_pr" ADD CONSTRAINT "m_pr_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "main"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "main"."m_pr" ADD CONSTRAINT "m_pr_pr_agency_m_agency_id_fk" FOREIGN KEY ("pr_agency") REFERENCES "main"."m_agency"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "main"."role_permission" ADD CONSTRAINT "role_permission_role_id_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "main"."role"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "main"."role_permission" ADD CONSTRAINT "role_permission_permission_id_m_permission_id_fk" FOREIGN KEY ("permission_id") REFERENCES "main"."m_permission"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_user_idx" ON "main"."audit_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "audit_entity_idx" ON "main"."audit_logs" USING btree ("entity","entity_id");--> statement-breakpoint
CREATE INDEX "audit_created_idx" ON "main"."audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "audit_role_idx" ON "main"."audit_logs" USING btree ("role");