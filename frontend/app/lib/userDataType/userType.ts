
export interface ResponseType {
    message: string,
    error: string | null,
    data: any
}

export interface SignupDataType {
    name: string,
    email: string,
    password: string,
    secret: string
}

export interface LoginDataType  {
    email: string,
    password: string,
}

export interface ResetPasswordDataType {
    email: string,
    newPassword: string,
    secret: string
}