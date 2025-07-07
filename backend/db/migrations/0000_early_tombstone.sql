CREATE TYPE "public"."channel_types" AS ENUM('text', 'voice');--> statement-breakpoint
CREATE TABLE "categories" (
	"server_guid" uuid NOT NULL,
	"category_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_name" varchar(128) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "channels" (
	"server_guid" uuid NOT NULL,
	"category_guid" uuid,
	"channel_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"channel_name" varchar(128) NOT NULL,
	"channel_type" "channel_types"
);
--> statement-breakpoint
CREATE TABLE "emojis" (
	"server_guid" uuid NOT NULL,
	"emoji_name" varchar(32) NOT NULL,
	"emoji_image" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "member_roles" (
	"user_guid" uuid NOT NULL,
	"server_guid" uuid NOT NULL,
	"role_id" uuid NOT NULL,
	CONSTRAINT "member_roles_role_id_server_guid_role_id_pk" PRIMARY KEY("role_id","server_guid","role_id")
);
--> statement-breakpoint
CREATE TABLE "members" (
	"server_guid" uuid NOT NULL,
	"user_guid" uuid NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"server_guid" uuid NOT NULL,
	"channel_guid" uuid NOT NULL,
	"user_guid" uuid NOT NULL,
	"message_guid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"message_content" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "private_user_info" (
	"user_guid" uuid PRIMARY KEY NOT NULL,
	"user_email" varchar(255),
	"user_email_verified" boolean,
	"user_password" text
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"guid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"server_id" uuid NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "servers" (
	"guid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner" uuid NOT NULL,
	"server_name" varchar(255) NOT NULL,
	"server_image" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"guid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(255) NOT NULL,
	"display_name" varchar(255),
	"description" text,
	"avatar_url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "username_valid" CHECK (length("username") >= 3 AND length("username") <= 32)
);
--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_server_guid_servers_guid_fk" FOREIGN KEY ("server_guid") REFERENCES "public"."servers"("guid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "channels" ADD CONSTRAINT "channels_server_guid_servers_guid_fk" FOREIGN KEY ("server_guid") REFERENCES "public"."servers"("guid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "channels" ADD CONSTRAINT "channels_category_guid_categories_category_id_fk" FOREIGN KEY ("category_guid") REFERENCES "public"."categories"("category_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "emojis" ADD CONSTRAINT "emojis_server_guid_servers_guid_fk" FOREIGN KEY ("server_guid") REFERENCES "public"."servers"("guid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member_roles" ADD CONSTRAINT "member_roles_user_guid_users_guid_fk" FOREIGN KEY ("user_guid") REFERENCES "public"."users"("guid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member_roles" ADD CONSTRAINT "member_roles_server_guid_servers_guid_fk" FOREIGN KEY ("server_guid") REFERENCES "public"."servers"("guid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member_roles" ADD CONSTRAINT "member_roles_role_id_roles_guid_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("guid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_server_guid_servers_guid_fk" FOREIGN KEY ("server_guid") REFERENCES "public"."servers"("guid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_user_guid_users_guid_fk" FOREIGN KEY ("user_guid") REFERENCES "public"."users"("guid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_server_guid_servers_guid_fk" FOREIGN KEY ("server_guid") REFERENCES "public"."servers"("guid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_channel_guid_channels_channel_id_fk" FOREIGN KEY ("channel_guid") REFERENCES "public"."channels"("channel_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_user_guid_users_guid_fk" FOREIGN KEY ("user_guid") REFERENCES "public"."users"("guid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "private_user_info" ADD CONSTRAINT "private_user_info_user_guid_users_guid_fk" FOREIGN KEY ("user_guid") REFERENCES "public"."users"("guid") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "roles" ADD CONSTRAINT "roles_server_id_servers_guid_fk" FOREIGN KEY ("server_id") REFERENCES "public"."servers"("guid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "servers" ADD CONSTRAINT "servers_owner_users_guid_fk" FOREIGN KEY ("owner") REFERENCES "public"."users"("guid") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "user_username_index" ON "users" USING btree ("username");