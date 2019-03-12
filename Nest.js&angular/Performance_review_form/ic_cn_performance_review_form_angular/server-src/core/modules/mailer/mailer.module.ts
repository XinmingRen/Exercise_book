import { DynamicModule, Global, Module } from "@nestjs/common";
import { FactoryProvider } from "@nestjs/common/interfaces";
import { MailerService } from "./mailer.service";
import { getEmailServiceToken } from "./mailer.utils";

@Global()
@Module({})
export class MailerModule {
  public static forRoot(options: any, name: string = "Default"): DynamicModule {
    const mailServiceProvider: FactoryProvider = {
      provide: getEmailServiceToken(name),
      useFactory: () => new MailerService(options),
    };
    return {
      exports: [mailServiceProvider],
      module: MailerModule,
      providers: [mailServiceProvider],
    };
  }
}
