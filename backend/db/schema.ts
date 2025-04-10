import { pgTable, pgEnum, boolean, check, index, text, timestamp, varchar, uuid } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const channelTypes = pgEnum('channel_types', [
    'text',
    'voice'
]);

export const users = pgTable('users', {
    guid: uuid('guid').defaultRandom().primaryKey(),
    username: varchar('username', { length: 255 }).notNull(),
    displayName: varchar('display_name', { length: 255 }),
    description: text('description'),
    avatarUrl: text('avatar_url').notNull(),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull()
}, (table) => {
    return {
        usernameIndex: index('user_username_index').on(table.username),
        usernameCheck: check('username_valid', sql`length("username") >= 3 AND length("username") <= 32`)
    };
});

export const privateUserInfo = pgTable('private_user_info', {
    userId: uuid('user_guid')
        .references(() => users.guid, { onDelete: 'cascade', onUpdate: 'cascade' })
        .primaryKey()
        .notNull(),
    email: varchar('user_email', { length: 255 }),
    emailVerified: boolean('user_email_verified'),
    password: text('user_password'), // Dw, this will be encrypted
});

export const servers = pgTable('servers', {
    guid: uuid('guid').defaultRandom().primaryKey(),
    owner: uuid('owner').references(() => users.guid, { onDelete: 'cascade', onUpdate: 'cascade', }).notNull(),
    name: varchar('server_name', { length: 255 }).notNull(),
    image: text('server_image').notNull(),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull()
});

export const categories = pgTable('categories', {
    serverId: uuid('server_guid')
        .references(() => servers.guid, { onDelete: 'cascade' })
        .notNull(),
    id: uuid('category_id').defaultRandom().primaryKey(),
    name: varchar('category_name', { length: 128 }).notNull()
});

export const channels = pgTable('channels', {
    serverId: uuid('server_guid')
        .references(() => servers.guid, { onDelete: 'cascade' })
        .notNull(),
    categoryId: uuid('category_guid')
        .references(() => categories.id, { onDelete: 'cascade' }),
    id: uuid('channel_id').defaultRandom().primaryKey(),
    name: varchar('channel_name', { length: 128 }).notNull(),
    type: channelTypes('channel_type')
});

export const roles = pgTable('roles', {
    guid: uuid('guid').defaultRandom().primaryKey(),
    serverId: uuid('server_id')
        .references(() => servers.guid, { onDelete: 'cascade' })
        .notNull(),
    name: text('name').notNull(),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull()
});

export const members = pgTable('members', {
    serverId: uuid('server_guid')
        .references(() => servers.guid, { onDelete: 'cascade' })
        .notNull(),
    
    userId: uuid('user_guid')
        .references(() => users.guid, { onDelete: 'cascade' })
        .notNull(),
    joinedAt: timestamp('joined_at', { mode: 'string' }).defaultNow().notNull()
});

export const emojis = pgTable('emojis', {
    serverId: uuid('server_guid')
        .references(() => servers.guid, { onDelete: 'cascade' })
        .notNull(),

    name: varchar('emoji_name', { length: 32 }).notNull(),
    image: text('emoji_image').notNull()
});

export const member_roles = pgTable('member_roles', {
    userId: uuid('user_guid')
        .references(() => users.guid, { onDelete: 'cascade' })
        .notNull(),

    serverId: uuid('server_guid')
        .references(() => servers.guid, { onDelete: 'cascade' })
        .notNull(),

    roleId: uuid('role_id')
        .references(() => roles.guid, { onDelete: 'cascade' })
        .notNull(),
});

export const messages = pgTable('messages', {
    serverId: uuid('server_guid')
        .references(() => servers.guid, { onDelete: 'cascade' })
        .notNull(),
    channelId: uuid('channel_guid')
        .references(() => channels.id, { onDelete: 'cascade' })
        .notNull(),
    userId: uuid('user_guid')
        .references(() => users.guid, { onDelete: 'cascade' })
        .notNull(),
    messageId: uuid('message_guid').defaultRandom().primaryKey(),
    content: text('message_content'),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull()
});