import "reflect-metadata";

import dotenv from "dotenv";
dotenv.config();

import compression from "compression";
import cookie from "cookie-parser";
import httpContext from "express-http-context";
import session from "express-session";
import helmet from "helmet";
import passport from "passport";

import { NestFactory } from "@nestjs/core";
import { RootModule } from "./root.module";

import { NestApplicationOptions } from "@nestjs/common/interfaces/nest-application-options.interface";
import { APP_CONFIG } from "./configs";
import { ExceptionModule, HttpExceptionFilter } from "./core/modules/exception";
import { Logger } from "./core/modules/logger";
import { httpContextMiddle } from "./core/shared/middlewares";
import utils from "./utils";

async function bootstrap() {
  try {
    const { port, cookieSecret, sessionSecret } = APP_CONFIG;
    const options: NestApplicationOptions = {
      logger: Logger,
    };
    const app = await NestFactory.create(RootModule, options);
    const exceptionModule = app.select(ExceptionModule);
    app.set("trust proxy", true);

    app.use(compression());
    app.use(helmet());
    app.use(cookie(cookieSecret));
    app.use(
      session({
        resave: false,
        saveUninitialized: true,
        secret: sessionSecret,
      }),
    );
    app.use(httpContext.middleware);
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(httpContextMiddle);

    app.useStaticAssets(utils.getPath("client"));
    app.useGlobalFilters(exceptionModule.get(HttpExceptionFilter));

    await app.listen(port);
  } catch (error) {
    Logger.error(error);
    throw error;
  }
}

bootstrap();
