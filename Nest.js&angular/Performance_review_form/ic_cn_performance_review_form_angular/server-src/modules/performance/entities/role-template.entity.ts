import { Column, Entity, OneToMany } from "typeorm";
import { FrameworkEntity } from "../../../framework/shared/framework.entity";
import { IndexTemplateEntity } from "./index-template.entity";

@Entity({ schema: "performance", name: "role-templates" })
export class RoleTemplateEntity extends FrameworkEntity {
  @Column("nvarchar", { length: 100 })
  public name: string;

  @OneToMany(
    () => IndexTemplateEntity,
    (indexTemplate) => indexTemplate.roleTemplate,
  )
  public indexs: IndexTemplateEntity[];

  @Column("nvarchar", { nullable: true, length: 300 })
  public comment: string | null;
}
