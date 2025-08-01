export type EnumType = EnumTypeString | EnumTypeNumber;

type EnumTypeString = {
  [key: string]: number;
};

type EnumTypeNumber = {
  [key: number]: string;
};