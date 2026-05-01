import { UserRepository } from "@application/ports/repositories/UserRepository";
import { TransactionContext } from "@application/ports/services/TransactionRunner";
import { User } from "@entities/User";
import { PostgresDatabaseService } from "@infrastructure/persistence/postgres/client/PostgresDatabaseService";
import { UUID } from "node:crypto";

type UserRow = { id: string; name: string; email: string; avatar_url: string };

const mapRow = (row: UserRow): User =>
  new User(row.id as UUID, row.name, row.email, row.avatar_url);

export class PostgresUserRepository implements UserRepository {
  constructor(private readonly db: PostgresDatabaseService) {}
  async createOne(user: User, tx?: TransactionContext): Promise<void> { await this.db.query("insert into users (id,name,email,avatar_url) values ($1,$2,$3,$4)", [user.id, user.name, user.email, user.avatarUrl], tx); }
  async getOneById(userId: UUID, tx?: TransactionContext): Promise<User | undefined> { const result = await this.db.query<UserRow>("select * from users where id=$1", [userId], tx); return result.rows[0] ? mapRow(result.rows[0]) : undefined; }
  async getOneByEmail(email: string, tx?: TransactionContext): Promise<User | undefined> { const result = await this.db.query<UserRow>("select * from users where email=$1", [email], tx); return result.rows[0] ? mapRow(result.rows[0]) : undefined; }
  async getManyByIds(ids: UUID[], tx?: TransactionContext): Promise<User[]> { const result = await this.db.query<UserRow>("select * from users where id = any($1::uuid[])", [ids], tx); return result.rows.map(mapRow); }
  async updateOne(user: User, tx?: TransactionContext): Promise<void> { await this.db.query("update users set name=$2,email=$3,avatar_url=$4 where id=$1", [user.id, user.name, user.email, user.avatarUrl], tx); }
  async deleteOneById(id: UUID, tx?: TransactionContext): Promise<void> { await this.db.query("delete from users where id=$1", [id], tx); }
}
