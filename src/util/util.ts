export const formatResponse=(succes:boolean, data:object, message:string, error:boolean)=>{
    return{
        succes,
        data,
        message,
        error,
    }
}