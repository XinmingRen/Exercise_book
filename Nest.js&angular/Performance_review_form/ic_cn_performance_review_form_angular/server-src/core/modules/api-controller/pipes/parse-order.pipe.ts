import { Injectable, PipeTransform } from "@nestjs/common";
import utils from "../../../../utils";

@Injectable()
export class ParseOrderPipe implements PipeTransform<any> {
  public async transform(order: any): Promise<any> {
    if (utils.isEmpty(order)) {
      order = {};
    }
    utils.forIn(order, (value, key) => {
      if (value === "1") {
        order[key] = 1;
      }
      if (value === "-1") {
        order[key] = -1;
      }
    });
    return order;
  }
}
