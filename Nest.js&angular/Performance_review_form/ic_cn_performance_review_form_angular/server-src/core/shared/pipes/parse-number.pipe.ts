import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from "@nestjs/common";
import _ from "lodash";

@Injectable()
export class ParseNumberPipe implements PipeTransform<string> {
  private nullable: boolean;

  constructor(nullable: boolean = true) {
    this.nullable = nullable;
  }

  public async transform(
    value: string,
    metadata: ArgumentMetadata,
  ): Promise<number | null> {
    if (this.nullable && value === undefined) {
      return null;
    }
    if (!this.nullable && value === undefined) {
      throw new BadRequestException();
    }
    return _.toNumber(value);
  }
}
