import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Strategy } from "passport-local";
import { Repository } from "typeorm";
import { LOCAL_STRATEGY_CONFIG } from "../../../../configs";
import { IRequest } from "../../../../core/shared/interfaces";
import { UserEntity } from "../../system/entities/user.entity";

@Injectable()
export class LocalStrategyService extends PassportStrategy(Strategy) {
  constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {
    super(LOCAL_STRATEGY_CONFIG);
  }

  public async validate(
    request: IRequest,
    username: string,
    password: string,
    done: Function,
  ) {
    const user = await this.userRepository.findOne({
      relations: ["roles"],
      where: {
        password,
        username,
      },
    });
    done(null, user);
  }
}
