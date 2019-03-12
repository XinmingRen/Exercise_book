import Express from "express";

export interface IResponse extends Express.Response {
  [x: string]: any;
}
