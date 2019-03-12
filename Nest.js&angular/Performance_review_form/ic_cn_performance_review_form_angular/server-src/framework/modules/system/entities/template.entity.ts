import { Column, Entity } from "typeorm";
import { FrameworkEntity } from "../../../shared/framework.entity";

@Entity({ schema: "system", name: "templates" })
export class TemplateEntity extends FrameworkEntity {
  @Column("nvarchar", { length: 100 })
  public code: string;

  @Column("nvarchar", { length: 100 })
  public title: string;

  @Column("nvarchar", { nullable: true, length: "MAX" })
  public content: string | null;

  @Column("nvarchar", { length: 100 })
  public sender: string;

  @Column("nvarchar", { nullable: true, length: 500 })
  public comment: string | null;
}
