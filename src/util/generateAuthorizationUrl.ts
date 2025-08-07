import { google } from "googleapis";
import { Request, Response } from "express";

export const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);

const scopes=[
    'https://mail.google.com/'
];

export const genAuthUrl=async (req: Request, res: Response)=>{
    try {
        const authorizationUrl= oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope:scopes,
            prompt:'consent'
        });
    res.status(200).json({message:`Auroriza tu aplicacion en esta Url: ${authorizationUrl}`});
    } catch (error) {
       res.status(500).json({mesage: error}) 
    }    
}