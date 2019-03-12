import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { UserEntity } from "../../../framework/modules/system/entities";
import { FrameworkEntity } from "../../../framework/shared/framework.entity";
import { ApprovalEntity } from "../../work-flow/entities";
import { ProjectPerformanceIndexEntity } from "./project-performance-index.entity";
import { ProjectRoleEntity } from "./project-role.entity";
import { ProjectEntity } from "./project.entity";

@Entity({ schema: "performance", name: "project-performances" })
export class ProjectPerformanceEntity extends FrameworkEntity {
  @Column("int", { name: "project_id", nullable: true })
  public projectId: number | null;

  @JoinColumn({ name: "project_id" })
  @ManyToOne(() => ProjectEntity)
  public project: ProjectEntity | null;

  @Column("int", { name: "role_id", nullable: true })
  public roleId: number | null;

  @JoinColumn({ name: "role_id" })
  @ManyToOne(() => ProjectRoleEntity)
  public role: ProjectRoleEntity | null;

  @Column("int", { name: "user_id", nullable: true })
  public userId: number | null;

  @JoinColumn({ name: "user_id" })
  @ManyToOne(() => UserEntity)
  public user: UserEntity | null;

  @Column("decimal", { nullable: true })
  public workload: number;
  @OneToMany(
    () => ProjectPerformanceIndexEntity,
    (projectPerformanceIndex) => projectPerformanceIndex.projectPerformance,
  )
  public indexs: ProjectPerformanceIndexEntity[];

  @Column("int")
  public status: number;

  @OneToMany(() => ApprovalEntity, (approval) => approval.projectPerformance)
  public approvals: ApprovalEntity[];

  @Column("decimal", { nullable: true, precision: 18, scale: 2 })
  public score: number;

  @Column("nvarchar", { nullable: true, length: 300 })
  public comment: string | null;
}
