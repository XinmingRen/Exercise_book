import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { CoreEntity } from "../../core/shared/core.entity";
import utils from "../../utils";
import { UserEntity } from "../modules/system/entities";

export abstract class FrameworkEntity extends CoreEntity {
  @Column("int", { name: "creater_id", nullable: true })
  public createrId: number | null;

  @JoinColumn({ name: "creater_id" })
  @ManyToOne(() => UserEntity)
  public creater: UserEntity | null;

  @Column("datetime2", { name: "create_date", nullable: true })
  public createDate: Date;

  @Column("int", { name: "updater_id", nullable: true })
  public updaterId: number | null;

  @JoinColumn({ name: "updater_id" })
  @ManyToOne(() => UserEntity)
  public updater: UserEntity | null;

  @Column("datetime2", { name: "update_date", nullable: true })
  public updateDate: Date;

  @BeforeInsert()
  public create() {
    this.createrId = utils.getCurrentUserId();
    this.createDate = new Date();
  }

  @BeforeUpdate()
  public update() {
    this.updaterId = utils.getCurrentUserId();
    this.updateDate = new Date();
  }
}
