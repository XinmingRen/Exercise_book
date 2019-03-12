import { Column, Entity } from "typeorm";
import { FrameworkEntity } from "../../../framework/shared/framework.entity";

@Entity({ schema: "performance", name: "performance-rates" })
export class PerformanceRateEntity extends FrameworkEntity {
  @Column("nvarchar", { length: 100 })
  public name: string;

  @Column("int")
  public rate: number;

  @Column("nvarchar", { nullable: true, length: 300 })
  public comment: string | null;
}
