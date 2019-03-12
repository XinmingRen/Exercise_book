import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from "typeorm";
import { FrameworkEntity } from "../../../shared/framework.entity";
import { RoleEntity } from "./role.entity";

@Entity({ schema: "system", name: "users" })
export class UserEntity extends FrameworkEntity {
  @Column("varchar", { length: 100, select: false })
  public username: string;

  @Column("varchar", { length: 100, select: false })
  public password: string;

  @Column("varchar", { name: "english_name", nullable: true, length: 100 })
  public englishName: string | null;

  @Column("varchar", { name: "chineseh_name", nullable: true, length: 100 })
  public chinesehName: string | null;

  @Column("varchar", { nullable: true, length: "MAX" })
  public avatar: string | null;

  @Column("varchar", { length: 100 })
  public email: string;

  @Column("int", { name: "line_manager_id", nullable: true })
  public lineManagerId: number | null;

  @JoinColumn({ name: "line_manager_id" })
  @ManyToOne(() => UserEntity)
  public lineManager: UserEntity | null;

  @JoinTable({
    inverseJoinColumn: { name: "role_id" },
    joinColumn: { name: "user_id" },
    name: "user-role-mapping",
    schema: "system",
  })
  @ManyToMany(() => RoleEntity)
  public roles: RoleEntity[];

  @Column("nvarchar", { nullable: true, length: 500 })
  public comment: string | null;
}
