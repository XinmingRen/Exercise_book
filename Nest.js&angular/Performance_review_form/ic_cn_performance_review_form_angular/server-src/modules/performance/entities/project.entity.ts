import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { UserEntity } from "../../../framework/modules/system/entities";
import { FrameworkEntity } from "../../../framework/shared/framework.entity";
import { ProjectPerformanceEntity } from "./project-performance.entity";
import { ProjectRoleEntity } from "./project-role.entity";

@Entity({ schema: "performance", name: "projects" })
export class ProjectEntity extends FrameworkEntity {
  @Column("nvarchar", { length: 100 })
  public bu: string;

  @Column("int", { name: "bu_header_id", nullable: true })
  public buHeaderId: number | null;

  @JoinColumn({ name: "bu_header_id" })
  @ManyToOne(() => UserEntity)
  public buHeader: UserEntity | null;

  @Column("int", { name: "project_manager_id", nullable: true })
  public projectManagerId: number | null;

  @JoinColumn({ name: "project_manager_id" })
  @ManyToOne(() => UserEntity)
  public projectManager: UserEntity | null;

  @Column("nvarchar", { length: 100 })
  public name: string;

  @Column("date", { name: "start_date" })
  public startDate: Date;

  @Column("date", { name: "end_date" })
  public endDate: Date;

  @Column("decimal")
  public hours: number;

  @OneToMany(() => ProjectRoleEntity, (projectRole) => projectRole.project)
  public roles: ProjectRoleEntity[];

  @OneToMany(
    () => ProjectPerformanceEntity,
    (projectPerformance) => projectPerformance.project,
  )
  public performances: ProjectPerformanceEntity[];
}
