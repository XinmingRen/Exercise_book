import utils from "../utils";
import { APP_CONFIG } from "./app.config";

const { emailHost, emailPassword, emailPort, emailUsername } = APP_CONFIG;

export const MAILER_CONFIG = {
  auth: utils.isLocal() ? { user: emailUsername, pass: emailPassword } : {},
  host: emailHost,
  port: emailPort,
  secure: emailPort === 465 ? true : false,
};
