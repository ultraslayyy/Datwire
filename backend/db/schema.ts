import { pgTable, check, index, text, varchar, uuid } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

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
});

export const server_roles = pgTable('server_roles', {
    guid: uuid('guid').defaultRandom().primaryKey(),
    serverId: uuid('server_id')
        .references(() => servers.guid, { onDelete: 'cascade' })
        .notNull(),
    name: text('name').notNull(),
})

export const server_members = pgTable('server_members', {
    serverId: uuid('server_guid')
        .references(() => servers.guid, { onDelete: 'cascade' })
        .notNull(),
    
    userId: uuid('user_guid')
        .references(() => users.guid, { onDelete: 'cascade' })
        .notNull(),

    roles: uuid('roles').references(() => server_roles.guid, { onDelete: 'cascade' }).notNull(),
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