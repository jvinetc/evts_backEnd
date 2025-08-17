import { Request, Response } from "express";
import Transbank from 'transbank-sdk';
import { byField, create, list, update } from "./crudController";
import { Payment } from "../models/Payment";
import { VerifyResponse } from "../interface/ApiTransbnak";
import { formatResponse } from "../util/util";
import { type } from "os";
import { Stop } from "../models";
import { IStop } from "../interface/Stop";

const { WebpayPlus, Options, Environment } = Transbank;

const apiKey = process.env.TRANSBANKC_APIKEY || '';
const commerceCode = process.env.COMMERCE_CODE || ''
const redirectUrl = process.env.POST_VERIFY || '';

export const createTransaction = async (req: Request, res: Response) => {
    const { amount, buyOrder, sessionId, returnUrl } = req.body;
    const baseUrl = process.env.BASE_URL;
    if (isNaN(Number(amount))) {
        return res.status(400).json({ error: 'El monto debe ser un número válido' });
    }
    try {
        const options = new Options(commerceCode, apiKey, Environment.Integration);
        const transaction = new WebpayPlus.Transaction(options);
        //const returnUrl = `${baseUrl}/payments/verify`;
        const response = await transaction.create(
            buyOrder,
            sessionId,
            Number(amount),
            returnUrl
        )
        res.status(200).json({
            token: response.token,
            url: response.url
        });
    } catch (error) {
        console.error('Error al crear transacción:', error);
        res.status(500).json({ error: 'No se pudo crear la transacción' });
    }
}

interface WebpayQuery {
    token_ws: string;
}

export const verifyPay = async (req: Request<{}, {}, {}, WebpayQuery>, res: Response) => {
    const { token_ws } = req.query;
    if (!token_ws) {
        return res.status(400).json({ error: ' no existe token de operacion' });
    }
    try {
        const options = new Options(commerceCode, apiKey, Environment.Integration);
        const transaction = new WebpayPlus.Transaction(options);
        const response = await transaction.commit(token_ws);
        const [text, date, sellId] = response.session_id.split('-');
        const body: VerifyResponse = {
            vci: response.vci,
            amount: response.amount,
            status: response.status,
            buy_order: response.buy_order,
            session_id: response.session_id,
            card_detail: response.card_detail.card_number,
            authorization_code: response.authorization_code,
            createAt: response.transaction_date,
            sellId: Number(sellId)
        }
        if (body.status !== 'AUTHORIZED') {
            //return res.redirect(`${redirectUrl}/valida_pago?error="El pago no pudo ser procesado"`)
            return res.status(400).json({menssage:'No fue autorizado el pago'})
        }
        await update(Stop, { buyOrder: body.buy_order }, { status: 'pickUp' });
        const payment = await create<VerifyResponse>(Payment, body);
        if (payment)
            //res.redirect(`${redirectUrl}/valida_pago?authorization_code=${body.authorization_code}`)
        res.status(200).json({authorization_code: body.authorization_code});

    } catch (error) {
        res.status(500).json({ error });
    }
}

export const getDataPayment = async (req: Request, res: Response) => {
    const { authorization_code } = req.params;
    if (!authorization_code)
        return res.status(400).json({ error: 'codigo de autorizacion vacio' });

    try {
        const paymentData = await byField(Payment, { authorization_code });
        if (!paymentData)
            return res.status(400).json({ error: 'No existe informacion para este codigo' });

        res.status(200).json(paymentData.dataValues);

    } catch (error) {
        console.log(error)
        res.status(500).json({ error });
    }
}