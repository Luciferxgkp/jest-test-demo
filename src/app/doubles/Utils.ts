export type StringInfo = {
  lowercase: String;
  uppercase: String;
  length: number;
  characters: String[];
  extraInfo: Object | undefined;
};

export function calculateComplexity(stringInfo: StringInfo) {
  return Object.keys(stringInfo.extraInfo).length * stringInfo.length;
}
