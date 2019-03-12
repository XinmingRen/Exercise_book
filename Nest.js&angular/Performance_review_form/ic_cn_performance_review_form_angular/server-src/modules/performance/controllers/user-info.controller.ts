import {
    Controller,
    Get,
    Request,
} from "@nestjs/common";
import { PREFIX_PATH_ENUM } from "../../../core/shared/enums";

@Controller(`${PREFIX_PATH_ENUM.V1}/userInfo`)
export class UserInfoController {
    @Get()
    public async getUserInfo(@Request() request: any) {
        return request.user; // 当前登陆用户信息
    }
}
