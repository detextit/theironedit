CREATE TABLE "enrollments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reference" text DEFAULT '' NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text DEFAULT '' NOT NULL,
	"program_id" text DEFAULT '' NOT NULL,
	"program_name" text DEFAULT '' NOT NULL,
	"goals" text DEFAULT '' NOT NULL,
	"availability" text DEFAULT '' NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"converted_member_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
