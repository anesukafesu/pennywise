import { CategoryRepository } from "@application/ports/repositories/CategoryRepository";
import { TransactionContext } from "@application/ports/services/TransactionRunner";
import { Category } from "@entities/Category";
import { PostgresDatabaseService } from "@infrastructure/persistence/postgres/client/PostgresDatabaseService";
import { UUID } from "node:crypto";
type Row={id:string;workspace_id:string;name:string;classification:Category["classification"];subclassification:Category["subclassification"]};
const map=(r:Row)=>new Category(r.id as UUID,r.workspace_id as UUID,r.name,r.classification,r.subclassification);
export class PostgresCategoryRepository implements CategoryRepository { constructor(private readonly db: PostgresDatabaseService) {}
async createOne(c:Category,tx?:TransactionContext){await this.db.query("insert into categories (id,workspace_id,name,classification,subclassification) values ($1,$2,$3,$4,$5)",[c.id,c.workspaceId,c.name,c.classification,c.subclassification],tx)}
async getOneById(id:UUID,tx?:TransactionContext){const r=await this.db.query<Row>("select * from categories where id=$1",[id],tx);return r.rows[0]?map(r.rows[0]):undefined}
async getManyByIds(ids:UUID[],tx?:TransactionContext){const r=await this.db.query<Row>("select * from categories where id = any($1::uuid[])",[ids],tx);return r.rows.map(map)}
async getManyByWorkspaceId(workspaceId:UUID,tx?:TransactionContext){const r=await this.db.query<Row>("select * from categories where workspace_id=$1",[workspaceId],tx);return r.rows.map(map)}
async getWorkspaceCategoriesAsMap(workspaceId:UUID,tx?:TransactionContext){const rows=await this.getManyByWorkspaceId(workspaceId,tx);return new Map<UUID, Category>(rows.map((v: Category) => [v.id, v]))}
async updateOne(c:Category,tx?:TransactionContext){await this.db.query("update categories set workspace_id=$2,name=$3,classification=$4,subclassification=$5 where id=$1",[c.id,c.workspaceId,c.name,c.classification,c.subclassification],tx)}
async deleteManyByWorkspaceId(workspaceId:UUID,tx?:TransactionContext){await this.db.query("delete from categories where workspace_id=$1",[workspaceId],tx)}
async deleteOneById(id:UUID,tx?:TransactionContext){await this.db.query("delete from categories where id=$1",[id],tx)} }
