import { Module } from "@nestjs/common";
import { HttpExceptionFilter } from "./http-exception.filter";

const services = [HttpExceptionFilter];

@Module({
  exports: [...services],
  providers: [...services],
})
export class ExceptionModule {}
