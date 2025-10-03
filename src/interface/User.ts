
export interface IUser {
    id?: number,
    firstName?: string,
    lastName?: string,
    email?: string,
    username?: string,
    age?: number,
    state?: string,
    phone?: string,
    contact?: string,
    password?: string,
    roleId?: number,
    photo?: string,
    verification_token?: string,
    expoPushToken?: string;
    birthDate?: Date;
    createAt?: Date;
    updateAt?: Date;
}
export interface ICreateAdmin {
    email: string;
    pass: string;
    firstName: string;
    lastName: string;
    phone: string;
    age: string;
    username: string;
    birthDate: Date;
    sellName: string;
    addres: string;
    comunaId: string;
}