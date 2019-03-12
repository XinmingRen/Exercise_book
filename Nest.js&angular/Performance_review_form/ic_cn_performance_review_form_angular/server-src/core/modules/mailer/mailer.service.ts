import { Injectable } from "@nestjs/common";
import { createTransport, SendMailOptions, Transporter } from "nodemailer";
import utils from "../../../utils";

@Injectable()
export class MailerService {
  public transport: Transporter;

  constructor(options: any) {
    this.transport = createTransport(options);
  }

  public async send(options: SendMailOptions) {
    try {
      const message = await this.transport.sendMail(options);
      utils.logger("[EMAIL]").info(message);
    } catch (error) {
      utils.logger("[EMAIL]").error(error);
    }
  }
}
