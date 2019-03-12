import { Injectable, PipeTransform } from "@nestjs/common";
import utils from "../../../../utils";

@Injectable()
export class ParseRelationsPipe implements PipeTransform<string> {
  public async transform(relations: string | string[]): Promise<any> {
    if (utils.isEmpty(relations)) {
      return [];
    }
    if (utils.isString(relations)) {
      return [relations];
    }
    return relations;
  }
}
