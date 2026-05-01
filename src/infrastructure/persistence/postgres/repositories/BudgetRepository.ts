import { BudgetRepository } from "@application/ports/repositories/BudgetRepository";import { TransactionContext } from "@application/ports/services/TransactionRunner";import { Budget } from "@entities/Budget";import { PostgresDatabaseService } from "@infrastructure/persistence/postgres/client/PostgresDatabaseService";import { UUID } from "node:crypto";
type Row={id:string;workspace_id:string;year:number;month:number}; const map=(r:Row)=>new Budget(r.id as UUID,r.workspace_id as UUID,r.year,r.month);
export class PostgresBudgetRepository implements BudgetRepository { constructor(private readonly db: PostgresDatabaseService) {}
async createOne(v:Budget,tx?:TransactionContext){await this.db.query("insert into budgets (id,workspace_id,year,month) values ($1,$2,$3,$4)",[v.id,v.workspaceId,v.year,v.month],tx)}
async getOneById(id:UUID,tx?:TransactionContext){const r=await this.db.query<Row>("select * from budgets where id=$1",[id],tx);return r.rows[0]?map(r.rows[0]):undefined}
async getOneByWorkspaceIdAndMonth(workspaceId:UUID,year:number,month:number,tx?:TransactionContext){const r=await this.db.query<Row>("select * from budgets where workspace_id=$1 and year=$2 and month=$3",[workspaceId,year,month],tx);return r.rows[0]?map(r.rows[0]):undefined}
async getManyByWorkspaceId(workspaceId:UUID,tx?:TransactionContext){const r=await this.db.query<Row>("select * from budgets where workspace_id=$1",[workspaceId],tx);return r.rows.map(map)}
async updateOne(v:Budget,tx?:TransactionContext){await this.db.query("update budgets set workspace_id=$2,year=$3,month=$4 where id=$1",[v.id,v.workspaceId,v.year,v.month],tx)}
async deleteOneById(id:UUID,tx?:TransactionContext){await this.db.query("delete from budgets where id=$1",[id],tx)}
async deleteManyByWorkspaceId(workspaceId:UUID,tx?:TransactionContext){await this.db.query("delete from budgets where workspace_id=$1",[workspaceId],tx)} }
