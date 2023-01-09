export const queryStringify = <T extends Record<string, unknown>>(
  data: T
): string => {
  const pairs: string[] = [];

  Object.keys(data).forEach((key) => {
    const value = data[key];

    if (Array.isArray(value) && !value.length) {
      return;
    }

    if (value == null || value === "") {
      return;
    }

    const val = Array.isArray(value) ? value.join(",") : String(value);
    pairs.push(`${key}=${val}`);
  });

  const result = pairs.join("&");
  return result;
};

export type QueryValue = string | number | string[]; // TODO
export type ParseOptions = {
  fields: Record<string, ParseType>;
};
export enum ParseType {
  STRING = "string",
  NUMBER = "number",
  ARRAY = "array",
}

export const parseQuery = <T extends object>(options: ParseOptions): T => {
  const search = window.location.search.slice(1);

  const pairs = search.split("&");

  const result: Record<string, QueryValue> = {};

  pairs.forEach((pair) => {
    const [key, val] = pair.split("=");
    const rawValue = decodeURI(val);

    let value: QueryValue = decodeURIComponent(rawValue);

    switch (options.fields[key]) {
      case ParseType.ARRAY:
        value = rawValue.split(",");
        break;

      case ParseType.NUMBER:
        value = parseInt(rawValue);
        break;

      case ParseType.STRING:
        value = rawValue;
        break;

      default:
        value = rawValue;
        break;
    }

    result[key] = value;
  });

  return result as T;
};
