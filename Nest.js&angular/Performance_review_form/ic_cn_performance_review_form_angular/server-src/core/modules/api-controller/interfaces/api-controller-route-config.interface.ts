import { REQUEST_METHOD_ENUM } from "../../../shared/enums";

export interface IApiControllerRouteConifg {
  action: string;
  method:
    | REQUEST_METHOD_ENUM.GET
    | REQUEST_METHOD_ENUM.POST
    | REQUEST_METHOD_ENUM.PUT
    | REQUEST_METHOD_ENUM.DELETE;
  path: string;
}
