import { Column, Entity } from "typeorm";
import { FrameworkEntity } from "../../../shared/framework.entity";

@Entity({ schema: "system", name: "pages" })
export class PageEntity extends FrameworkEntity {
  @Column("nvarchar", { length: 100 })
  public name: string;

  @Column("nvarchar", { length: 100 })
  public url: string;

  @Column("nvarchar", { nullable: true, length: "MAX" })
  public requests: string | null;

  @Column("nvarchar", { nullable: true, length: 500 })
  public comment: string | null;
}
