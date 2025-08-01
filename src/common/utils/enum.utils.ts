import { EnumType } from "../types/enum-type";


export const getEnumStringKey = (EnumType: EnumType, key: number): string =>
    EnumType[key];