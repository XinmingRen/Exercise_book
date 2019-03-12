import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { FrameworkEntity } from "../../../framework/shared/framework.entity";
import { ProjectIndexEntity } from "./project-index.entity";
import { ProjectEntity } from "./project.entity";

@Entity({ schema: "performance", name: "project-roles" })
export class ProjectRoleEntity extends FrameworkEntity {
  @Column("int", { name: "project_id", nullable: true })
  public projectId: number | null;

  @JoinColumn({ name: "project_id" })
  @ManyToOne(() => ProjectEntity)
  public project: ProjectEntity;

  @Column("nvarchar", { length: 100 })
  public name: string;

  @OneToMany(() => ProjectIndexEntity, (projectIndex) => projectIndex.role)
  public indexs: ProjectIndexEntity[];

  @Column("nvarchar", { nullable: true, length: 300 })
  public comment: string | null;
}
