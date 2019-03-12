import { Injectable, PipeTransform } from "@nestjs/common";
import utils from "../../../../utils";

@Injectable()
export class ParseWherePipe implements PipeTransform<any> {
  public async transform(where: any): Promise<any> {
    if (utils.isEmpty(where)) {
      return {};
    }
    return where;
  }
}
