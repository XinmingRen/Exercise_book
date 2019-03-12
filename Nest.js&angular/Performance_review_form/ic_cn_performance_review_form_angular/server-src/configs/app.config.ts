import utils from "../utils";

const {
  env: {
    ENVIRONMENT,
    LOGIN_GUARD_ENABLE,
    PORT,
    ROLE_GUARD_ENABLE,
    WEB_HOST,

    DEBUG_FOLDER,
    DEBUG_LEVEL,

    COOKIE_SECRET,
    SESSION_SECRET,

    DATABASE_HOST,
    DATABASE_INSTANCE,
    DATABASE_NAME,
    DATABASE_PASSWORD,
    DATABASE_PORT,
    DATABASE_USERNAME,

    LOCAL_PASSWORD_FIELD,
    LOCAL_USERNAME_FIELD,

    EMAIL_HOST,
    EMAIL_PASSWORD,
    EMAIL_PORT,
    EMAIL_USERNAME,
  },
} = process;

export const APP_CONFIG = {
  environment: utils.toString(ENVIRONMENT),
  loginGuardEnable: utils.toBoolean(LOGIN_GUARD_ENABLE),
  port: utils.toNumber(PORT),
  roleGuardEnable: utils.toBoolean(ROLE_GUARD_ENABLE),
  webHost: utils.toString(WEB_HOST),

  debugFolder: utils.toString(DEBUG_FOLDER),
  debugLevel: utils.toString(DEBUG_LEVEL),

  cookieSecret: utils.toString(COOKIE_SECRET),
  sessionSecret: utils.toString(SESSION_SECRET),

  databaseHost: utils.toString(DATABASE_HOST),
  databaseInstance: utils.toString(DATABASE_INSTANCE),
  databaseName: utils.toString(DATABASE_NAME),
  databasePassword: utils.toString(DATABASE_PASSWORD),
  databasePort: utils.toNumber(DATABASE_PORT),
  databaseUsername: utils.toString(DATABASE_USERNAME),

  localPasswordField: utils.toString(LOCAL_PASSWORD_FIELD),
  localUsernameField: utils.toString(LOCAL_USERNAME_FIELD),

  emailHost: utils.toString(EMAIL_HOST),
  emailPassword: utils.toString(EMAIL_PASSWORD),
  emailPort: utils.toNumber(EMAIL_PORT),
  emailUsername: utils.toString(EMAIL_USERNAME),
};
