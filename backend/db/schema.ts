import { pgTable, pgEnum, check, index, text, varchar, uuid } from 'drizzle-orm/pg-core';
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
    avatarUrl: text('avatar_url').notNull()
}, (table) => {
    return {
        usernameIndex: index('user_username_index').on(table.username),
        usernameCheck: check('username_valid', sql`length("username") >= 3 AND length("username") <= 32`)
    };
});

export const servers = pgTable('servers', {
    guid: uuid('guid').defaultRandom().primaryKey(),
    owner: uuid('owner').references(() => users.guid, { onDelete: 'cascade', onUpdate: 'cascade', }).notNull(),
    name: varchar('server_name', { length: 255 }).notNull(),
    image: text('server_image').notNull(),
});

export const server_categories = pgTable('server_categories', {
    serverId: uuid('server_guid')
        .references(() => servers.guid, { onDelete: 'cascade' })
        .notNull(),
    id: uuid('category_id').defaultRandom().primaryKey(),
    name: varchar('category_name', { length: 128 }).notNull()
});

export const server_channels = pgTable('server_channels', {
    serverId: uuid('server_guid')
        .references(() => servers.guid, { onDelete: 'cascade' })
        .notNull(),
    categoryId" uuid('category_guid')
        .references(() => server_categories.id, { onDelete: 'cascade' }),
    id: uuid('channel_id').defaultRandom().primaryKey(),
    name: varchar('channel_name', { length: 128 }).notNull(),
    type: channelTypes('channel_type')
});

export const server_roles = pgTable('server_roles', {
    guid: uuid('guid').defaultRandom().primaryKey(),
    serverId: uuid('server_id')
        .references(() => servers.guid, { onDelete: 'cascade' })
        .notNull(),
    name: text('name').notNull(),
});

export const server_members = pgTable('server_members', {
    serverId: uuid('server_guid')
        .references(() => servers.guid, { onDelete: 'cascade' })
        .notNull(),
    
    userId: uuid('user_guid')
        .references(() => users.guid, { onDelete: 'cascade' })
        .notNull(),
    // Something is wrong here. My brain isn't braining to fix it rn
    roles: uuid('roles').references(() => server_roles.guid, { onDelete: 'cascade' }).notNull(),
});

export const server_emojis = pgTable('server_emojis', {
    serverId: uuid('server_guid')
        .references(() => servers.guid, { onDelete: 'cascade' })
        .notNull(),

    name: varchar('emoji_name', { length: 32 }),
    image: text('emoji-image')
});

export const member_roles = pgTable('member_roles', {
    userId: uuid('user_guid')
        .references(() => users.guid, { onDelete: 'cascade' })
        .notNull(),

    serverId: uuid('server_guid')
        .references(() => servers.guid, { onDelete: 'cascade' })
        .notNull(),

    roleId: uuid('role_id')
        .references(() => server_roles.guid, { onDelete: 'cascade' })
        .notNull(),
});