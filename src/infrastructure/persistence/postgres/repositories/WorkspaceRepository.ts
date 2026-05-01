import { WorkspaceRepository } from "@application/ports/repositories/WorkspaceRepository";
import { TransactionContext } from "@application/ports/services/TransactionRunner";
import { Workspace } from "@entities/Workspace";
import { PostgresDatabaseService } from "@infrastructure/persistence/postgres/client/PostgresDatabaseService";
import { UUID } from "node:crypto";
type Row={id:string;name:string;description:string;date_created:Date;currency_code:string};
const map=(r:Row)=>new Workspace(r.id as UUID,r.name,r.description,new Date(r.date_created),r.currency_code);
export class PostgresWorkspaceRepository implements WorkspaceRepository { constructor(private readonly db: PostgresDatabaseService) {}
async createOne(w: Workspace, tx?: TransactionContext){await this.db.query("insert into workspaces (id,name,description,date_created,currency_code) values ($1,$2,$3,$4,$5)",[w.id,w.name,w.description,w.dateCreated,w.currencyCode],tx)}
async getOneById(id: UUID, tx?: TransactionContext){const r=await this.db.query<Row>("select * from workspaces where id=$1",[id],tx);return r.rows[0]?map(r.rows[0]):undefined}
async getManyByIds(ids: UUID[], tx?: TransactionContext){const r=await this.db.query<Row>("select * from workspaces where id = any($1::uuid[])",[ids],tx);return r.rows.map(map)}
async deleteOneById(id: UUID, tx?: TransactionContext){await this.db.query("delete from workspaces where id=$1",[id],tx)}
async updateOne(w: Workspace, tx?: TransactionContext){await this.db.query("update workspaces set name=$2,description=$3,date_created=$4,currency_code=$5 where id=$1",[w.id,w.name,w.description,w.dateCreated,w.currencyCode],tx)} }
