import { PrimaryGeneratedColumn } from "typeorm";

export abstract class CoreEntity {
  @PrimaryGeneratedColumn()
  public id: number;
}
