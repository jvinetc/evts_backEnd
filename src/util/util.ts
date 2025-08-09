export const formatResponse=(succes:boolean, data:any, message:string, error:boolean)=>{
    return{
        succes,
        data,
        message,
        error,
    }
}