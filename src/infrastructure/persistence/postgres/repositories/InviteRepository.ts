import { InviteRepository } from "@application/ports/repositories/InviteRepository";import { TransactionContext } from "@application/ports/services/TransactionRunner";import { Invite } from "@entities/Invite";import { PostgresDatabaseService } from "@infrastructure/persistence/postgres/client/PostgresDatabaseService";import { UUID } from "node:crypto";
type Row={id:string;user_id:string;workspace_id:string;expires_on:Date}; const map=(r:Row)=>new Invite(r.id as UUID,r.user_id as UUID,r.workspace_id as UUID,new Date(r.expires_on));
export class PostgresInviteRepository implements InviteRepository { constructor(private readonly db: PostgresDatabaseService) {}
async createOne(v:Invite,tx?:TransactionContext){await this.db.query("insert into invites (id,user_id,workspace_id,expires_on) values ($1,$2,$3,$4)",[v.id,v.userId,v.workspaceId,v.expiresOn],tx)}
async getOneById(id:UUID,tx?:TransactionContext){const r=await this.db.query<Row>("select * from invites where id=$1",[id],tx);return r.rows[0]?map(r.rows[0]):undefined}
async getOneByUserIdAndWorkspaceId(userId:UUID,workspaceId:UUID,tx?:TransactionContext){const r=await this.db.query<Row>("select * from invites where user_id=$1 and workspace_id=$2",[userId,workspaceId],tx);return r.rows[0]?map(r.rows[0]):undefined}
async getManyByWorkspaceId(workspaceId:UUID,tx?:TransactionContext){const r=await this.db.query<Row>("select * from invites where workspace_id=$1",[workspaceId],tx);return r.rows.map(map)}
async getManyByUserId(userId:UUID,tx?:TransactionContext){const r=await this.db.query<Row>("select * from invites where user_id=$1",[userId],tx);return r.rows.map(map)}
async deleteManyByWorkspaceId(workspaceId:UUID,tx?:TransactionContext){await this.db.query("delete from invites where workspace_id=$1",[workspaceId],tx)}
async deleteManyByUserId(userId:UUID,tx?:TransactionContext){await this.db.query("delete from invites where user_id=$1",[userId],tx)}
async deleteOneById(id:UUID,tx?:TransactionContext){await this.db.query("delete from invites where id=$1",[id],tx)} }
