
export interface IRole extends Document {
    id?: number,
    name: string,
    description?:string,
    createAt: Date,
    updateAt?: Date,
}