import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";

@Injectable()
export class PassportSerializerService extends PassportSerializer {
  public serializeUser(userId: number, done: Function) {
    done(null, userId);
  }

  public deserializeUser(userId: number, done: Function) {
    done(null, userId);
  }
}
