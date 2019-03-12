import { Controller, Delete, Get, HttpCode, Post, Put } from "@nestjs/common";
import utils from "../../../utils";
import {
  HTTP_STATUS_CODE_ENUM,
  PREFIX_PATH_ENUM,
  REQUEST_METHOD_ENUM,
} from "../../shared/enums";
import { IApiControllerConfig, IApiControllerRouteConifg } from "./interfaces";

export const addController = (
  target: Function,
  conifg: IApiControllerConfig,
) => {
  const { apiPrefix, rootPrefix } = conifg;
  let path = "";
  if (rootPrefix !== undefined) {
    path += `${rootPrefix}/`;
  }
  path += `${PREFIX_PATH_ENUM.V1}/`;
  if (apiPrefix !== undefined) {
    path += apiPrefix;
  }
  Controller(path)(target);
};

export const addRoutes = (
  target: Function,
  conifg: IApiControllerConfig,
  routes: IApiControllerRouteConifg[],
) => {
  utils.forEach(routes, (route) => {
    const descriptor = Reflect.getOwnPropertyDescriptor(
      target.prototype.__proto__,
      route.action,
    );
    if (descriptor === undefined) {
      return;
    }
    if (route.method === REQUEST_METHOD_ENUM.GET) {
      Get(route.path)(target, route.action, descriptor);
    }
    if (route.method === REQUEST_METHOD_ENUM.POST) {
      Post(route.path)(target, route.action, descriptor);
      HttpCode(HTTP_STATUS_CODE_ENUM.OK)(target, route.action, descriptor);
    }
    if (route.method === REQUEST_METHOD_ENUM.PUT) {
      Put(route.path)(target, route.action, descriptor);
    }
    if (route.method === REQUEST_METHOD_ENUM.DELETE) {
      Delete(route.path)(target, route.action, descriptor);
    }
  });
};
