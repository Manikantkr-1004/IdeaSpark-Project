
export interface ResponseType {
    message: string,
    error: string | null,
    data: any
}

export type LoginHistoryType = {
    _id: string,
    date: string,
    provider: 'credentials' | 'google' | 'github'
}

export interface ProfileDataType {
    _id: string,
    name: string,
    email: string,
    image: string,
    createdAt: string,
    loginHistory : LoginHistoryType[]
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