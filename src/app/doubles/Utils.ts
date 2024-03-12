import { v4 } from "uuid";

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

export function toUpperCase(arg: string): string {
  return arg.toUpperCase();
}
export function toLowerCase(arg: string): string {
  return arg.toLowerCase() + v4();
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

export class OtherStringUtils {
  public toUpperCase(arg: string) {
    return arg.toUpperCase();
  }

  public logString(arg: string) {
    console.log(arg);
  }
}
