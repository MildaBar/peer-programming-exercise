import { Kysely, SqliteDatabase, sql } from 'kysely'

export async function up(db: Kysely<SqliteDatabase>) {
  await db.schema
    .createTable('screenings')
    .ifNotExists()
    .addColumn('id', 'integer', (c) => c.primaryKey().autoIncrement().notNull())
    .addColumn('movie_id', 'integer', (c) =>
      c.notNull().references('movies.id')
    )
    .addColumn('number_of_tickets', 'integer', (c) => c.notNull())
    .addColumn('number_of_tickets_left', 'integer', (c) => c.notNull())
    .addColumn('movie_title', 'text', (c) => c.notNull())
    .addColumn('movie_year', 'integer', (c) => c.notNull())
    .addColumn('created_at', 'datetime', (column) =>
      column.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .execute()
}

export async function down(db: Kysely<SqliteDatabase>) {
  await db.schema.dropTable('screenings').execute()
}
