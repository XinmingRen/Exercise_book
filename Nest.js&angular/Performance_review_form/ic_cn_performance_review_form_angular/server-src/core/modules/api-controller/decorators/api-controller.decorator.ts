import { addController, addRoutes } from "../api-controller.utils";
import { API_CONTROLLER_ROUTES_CONFIG } from "../configs";
import { IApiControllerConfig } from "../interfaces";

export function ApiController(config: IApiControllerConfig) {
  return (target: Function) => {
    addController(target, config);
    addRoutes(target, config, API_CONTROLLER_ROUTES_CONFIG);
  };
}
