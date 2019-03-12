import { DynamicModule, Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Global()
@Module({})
export class RepositoryModule {
  public static forFeature(entities: Function[]): DynamicModule {
    return {
      exports: [TypeOrmModule.forFeature(entities)],
      imports: [TypeOrmModule.forFeature(entities)],
      module: RepositoryModule,
    };
  }
}
