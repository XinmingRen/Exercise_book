import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { FrameworkEntity } from "../../../framework/shared/framework.entity";
import { RoleTemplateEntity } from "./role-template.entity";

@Entity({ schema: "performance", name: "index-templates" })
export class IndexTemplateEntity extends FrameworkEntity {
  @Column("int", { name: "role_template_id", nullable: true })
  public roleTemplateId: number | null;

  @JoinColumn({ name: "role_template_id" })
  @ManyToOne(() => RoleTemplateEntity)
  public roleTemplate: RoleTemplateEntity | null;

  @Column("nvarchar", { length: 100 })
  public name: string;

  @Column("nvarchar", { length: 300 })
  public explain: string;

  @Column("int")
  public weight: number;

  @Column("nvarchar", { length: 300 })
  public standard: string;
}
