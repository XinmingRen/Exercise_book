import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { FrameworkEntity } from "../../../framework/shared/framework.entity";
import { ProjectRoleEntity } from "./project-role.entity";
import { ProjectEntity } from "./project.entity";

@Entity({ schema: "performance", name: "project-indexs" })
export class ProjectIndexEntity extends FrameworkEntity {
  @Column("int", { name: "project_id", nullable: true })
  public projectId: number | null;

  @JoinColumn({ name: "project_id" })
  @ManyToOne(() => ProjectEntity)
  public project: ProjectEntity;

  @Column("int", { name: "role_id", nullable: true })
  public roleId: number | null;

  @JoinColumn({ name: "role_id" })
  @ManyToOne(() => ProjectRoleEntity)
  public role: ProjectRoleEntity | null;

  @Column("nvarchar", { length: 100 })
  public name: string;

  @Column("nvarchar", { length: 300 })
  public explain: string;

  @Column("int")
  public weight: number;

  @Column("nvarchar", { length: 300 })
  public standard: string;
}
