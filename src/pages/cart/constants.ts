import { ParseOptions, ParseType } from "../../helpers/api/router";
import { QueryName } from "./types";

export const parseOptions: ParseOptions = {
  fields: {
    [QueryName.LIMIT]: ParseType.NUMBER,
    [QueryName.PAGE]: ParseType.NUMBER,
  },
};
