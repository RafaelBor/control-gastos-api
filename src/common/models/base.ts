export interface BaseResponseModel<T> {
    code: string | null;
    message: string;
    data: T | null;
}


export interface LoginResponseModel<T>{
    code: string | null;
    message: string;
    data: T | null;
    token: string | null
}