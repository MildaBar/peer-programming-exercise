import type { Selectable, Updateable, Insertable } from 'kysely'
import type { Database, Tickets } from '@/database'
import { keys } from './schema'

const TABLE = 'tickets'
type Row = Tickets
type RowSelect = Selectable<Row>
type RowWithoutId = Omit<Row, 'id'>
type RowInsert = Insertable<RowWithoutId>
type RowUpdate = Updateable<RowWithoutId>

export default (db: Database) => ({
  findAll(): Promise<RowSelect[]> {
    return db.selectFrom(TABLE).selectAll().execute()
  },

  findById(id: number): Promise<RowSelect | undefined> {
    return db
      .selectFrom(TABLE)
      .select(keys)
      .where('id', '=', id)
      .executeTakeFirst()
  },

  findByUserId(userId: number): Promise<RowSelect | undefined> {
    return db
      .selectFrom(TABLE)
      .select(keys)
      .where('userId', '=', userId)
      .executeTakeFirst()
  },

  update(id: number, partial: RowUpdate): Promise<RowSelect | undefined> {
    if (Object.keys(partial).length === 0) {
      return this.findById(id)
    }

    return db
      .updateTable(TABLE)
      .set(partial)
      .where('id', '=', id)
      .returning(keys)
      .executeTakeFirst()
  },

  create(data: RowInsert): Promise<RowSelect | undefined> {
    return db.insertInto(TABLE).values(data).returning(keys).executeTakeFirst()
  },
})
