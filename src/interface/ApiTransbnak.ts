export interface VerifyResponse {
    id?:number;
    amount: number;
    status: string;
    vci: string;
    buy_order: string;
    session_id: string;
    card_detail: string;
    authorization_code: string;
    createAt:Date, 
    sellId:number

}