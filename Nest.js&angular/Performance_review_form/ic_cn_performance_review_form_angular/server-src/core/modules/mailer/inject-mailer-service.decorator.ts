import { Inject } from "@nestjs/common";
import { getEmailServiceToken } from "./mailer.utils";

export const InjectMailerService = (name: string = "Default") =>
  Inject(getEmailServiceToken(name));
