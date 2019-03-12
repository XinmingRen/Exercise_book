import { ConnectionOptions } from "typeorm";
import { DatabaseLogger } from "../core/modules/logger";
import utils from "../utils";
import { APP_CONFIG } from "./app.config";

const {
  databaseName,
  databaseInstance,
  databaseHost,
  databasePassword,
  databasePort,
  databaseUsername,
} = APP_CONFIG;
const logging: any = utils.isLocal() ? true : ["schema", "error", "migration"];

export const DATABASE_CONFIG: ConnectionOptions = {
  database: databaseName,
  entities: [
    utils.getPath(__dirname, "../framework/modules/**/**.entity{.ts,.js}"),
    utils.getPath(__dirname, "../modules/**/**.entity{.ts,.js}"),
  ],
  extra: { instanceName: databaseInstance },
  host: databaseHost,
  logger: new DatabaseLogger(logging),
  logging,
  password: databasePassword,
  port: databasePort,
  synchronize: true,
  type: "mssql",
  username: databaseUsername,
};
