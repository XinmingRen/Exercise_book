import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { UserEntity } from "../../../framework/modules/system/entities";
import { FrameworkEntity } from "../../../framework/shared/framework.entity";
import { ProjectPerformanceEntity } from "../../performance/entities";

@Entity({ schema: "work_flow", name: "approvals" })
export class ApprovalEntity extends FrameworkEntity {
  @Column("int", { name: "project_performance_id", nullable: true })
  public projectPerformanceId: number | null;

  @JoinColumn({ name: "project_performance_id" })
  @ManyToOne(() => ProjectPerformanceEntity)
  public projectPerformance: ProjectPerformanceEntity | null;

  @Column("int", { name: "level" })
  public level: number;

  @Column("int", { name: "approver_id", nullable: true })
  public approverId: number | null;

  @JoinColumn({ name: "approver_id" })
  @ManyToOne(() => UserEntity)
  public approver: UserEntity | null;

  @Column("datetime2")
  public date: Date;

  @Column("int")
  public status: string;

  @Column("nvarchar", { nullable: true, length: 300 })
  public comment: string | null;
}
