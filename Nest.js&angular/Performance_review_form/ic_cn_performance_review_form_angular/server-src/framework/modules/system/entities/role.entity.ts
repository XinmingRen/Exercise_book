import { Column, Entity, JoinTable, ManyToMany } from "typeorm";
import { FrameworkEntity } from "../../../shared/framework.entity";
import { PageEntity } from "./page.entity";
import { UserEntity } from "./user.entity";

@Entity({ schema: "system", name: "roles" })
export class RoleEntity extends FrameworkEntity {
  @Column("nvarchar", { length: 100 })
  public name: string;

  @JoinTable({
    inverseJoinColumn: { name: "user_id" },
    joinColumn: { name: "role_id" },
    name: "user-role-mapping",
    schema: "system",
  })
  @ManyToMany(() => UserEntity)
  public users: UserEntity[];

  @JoinTable({
    inverseJoinColumn: { name: "page_id" },
    joinColumn: { name: "role_id" },
    name: "role-page-mapping",
  })
  @ManyToMany(() => PageEntity)
  public pages: PageEntity[];

  @Column("nvarchar", { nullable: true, length: 500 })
  public comment: string | null;
}
