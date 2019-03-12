import { IStrategyOptionsWithRequest } from "passport-local";
import { APP_CONFIG } from "./app.config";

const { localPasswordField, localUsernameField } = APP_CONFIG;

export const LOCAL_STRATEGY_CONFIG: IStrategyOptionsWithRequest = {
  passReqToCallback: true,
  passwordField: localPasswordField,
  usernameField: localUsernameField,
};
