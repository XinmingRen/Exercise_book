import { Module } from "@nestjs/common";
import { PassportController } from "./controllers";
import { LocalStrategyService, PassportSerializerService } from "./services";

const controllers = [PassportController];
const services = [LocalStrategyService, PassportSerializerService];

@Module({
  controllers,
  providers: [...services],
})
export class PassportModule {}
