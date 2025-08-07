export const eliminarTildes=(texto:string)=> {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g,"");
}

export const formatResponse=(succes:boolean, data:object, message:string, error:boolean)=>{
    return{
        succes,
        data,
        message,
        error,
    }
}