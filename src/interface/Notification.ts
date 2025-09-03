export interface INotification {
    id?:number;
    title?: string;
    message?: string; // URL pública en Cloudinary
    userId?: number;
    sellId?:number;
    orderBuy?:string;
    type?: string;
    createAt?: Date;
    read?: boolean;
}