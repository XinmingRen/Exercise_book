import Express from "express";

export interface IRequest extends Express.Request {
  [x: string]: any;
}
