export function toUpperCase(arg: String) {
  return arg.toUpperCase();
}

export type StringInfo = {
  lowercase: String;
  uppercase: String;
  length: Number;
  characters: String[];
  extraInfo: Object | undefined;
};

export function getStringInfo(args: String): StringInfo {
  return {
    lowercase: args.toLowerCase(),
    characters: Array.from(args),
    uppercase: args.toUpperCase(),
    length: args.length,
    extraInfo: {},
  };
}
