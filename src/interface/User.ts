
export interface IUser {
    id?: number,
    firstName?: string,
    lastName?: string,
    email: string,
    username?: string,
    age?: number,
    state?: string,
    mobile?: string,
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