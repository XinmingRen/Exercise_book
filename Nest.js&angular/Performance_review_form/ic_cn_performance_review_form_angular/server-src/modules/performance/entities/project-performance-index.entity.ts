import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { FrameworkEntity } from "../../../framework/shared/framework.entity";
import { PerformanceRateEntity } from "./performance-rate.entity";
import { ProjectPerformanceEntity } from "./project-performance.entity";
import { ProjectEntity } from "./project.entity";

@Entity({ schema: "performance", name: "project-performance-indexs" })
export class ProjectPerformanceIndexEntity extends FrameworkEntity {
  @Column("int", { name: "project_id", nullable: true })
  public projectId: number | null;
  @JoinColumn({ name: "project_id" })
  @ManyToOne(() => ProjectEntity)
  public project: ProjectEntity | null;

  @Column("int", { name: "project_performance_id", nullable: true })
  public projectPerformanceId: number | null;

  @JoinColumn({ name: "project_performance_id" })
  @ManyToOne(() => ProjectPerformanceEntity)
  public projectPerformance: ProjectPerformanceEntity | null;

  @Column("int")
  public type: number;

  @Column("nvarchar", { length: 100 })
  public name: string;

  @Column("nvarchar", { length: 300 })
  public explain: string;

  @Column("int")
  public weight: number;

  @Column("nvarchar", { length: 300 })
  public standard: string;

  @Column("int", { name: "rate_id", nullable: true })
  public rateId: string | null;

  @JoinColumn({ name: "rate_id" })
  @ManyToOne(() => PerformanceRateEntity)
  public rate: PerformanceRateEntity | null;

  @Column("nvarchar", { nullable: true, length: 300 })
  public comment: string | null;
}
