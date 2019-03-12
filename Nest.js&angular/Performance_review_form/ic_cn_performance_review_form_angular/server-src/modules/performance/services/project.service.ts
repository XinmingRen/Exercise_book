import { Injectable } from "@nestjs/common";
import _ from "lodash";

@Injectable()
export class ProjectService {
    public authenticate(userInfo: any): string {
        let authentication: string = "No Permissions";
        if (userInfo !== undefined) {
            _.forEach(userInfo.roles, (value) => {
                if (value.name === "HR") {
                    authentication = "Authority of HR";
                    return false;
                } else if (value.name === "PM") {
                    authentication = "Authority of PM";
                    return false;
                } else if (value.name === "Worker") {
                    authentication = "Authority of Worker";
                    return false;
                }
            });
        }
        return authentication;
    }
}
