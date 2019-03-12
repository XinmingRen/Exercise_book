import { REQUEST_METHOD_ENUM } from "../../../shared/enums";
import { IApiControllerRouteConifg } from "../interfaces";

const { GET, POST, PUT, DELETE } = REQUEST_METHOD_ENUM;

export const API_CONTROLLER_ROUTES_CONFIG: IApiControllerRouteConifg[] = [
  { method: GET, path: "andCount", action: "findAndCount" },
  { method: GET, path: "", action: "find" },
  { method: GET, path: "one", action: "findOneByFilter" },
  { method: GET, path: ":id", action: "findOneById" },
  { method: POST, path: "", action: "create" },
  { method: POST, path: "one", action: "createOne" },
  { method: PUT, path: "", action: "update" },
  { method: PUT, path: "one", action: "updateOneByFilter" },
  { method: PUT, path: ":id", action: "updateOneById" },
  { method: DELETE, path: "", action: "delete" },
  { method: DELETE, path: "one", action: "deleteOneByFilter" },
  { method: DELETE, path: ":id", action: "deleteOneById" },
];
