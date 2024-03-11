export type StringInfo = {
  lowercase: String;
  uppercase: String;
  length: number;
  characters: String[];
  extraInfo: Object | undefined;
};
type LoggerServiceCallBack = (arg: string) => void;
export function calculateComplexity(stringInfo: StringInfo) {
  return Object.keys(stringInfo.extraInfo).length * stringInfo.length;
}

export function toUpperCaseWithCb(
  args: string,
  callback: LoggerServiceCallBack
) {
  if (!args) {
    callback("Invalid argument!");
    return;
  }

  callback(`called function with ${args}`);
  return args.toUpperCase();
}
