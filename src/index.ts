import express, { Request, Response } from 'express';
import cors from 'cors';
import comunaRouter from './routes/Comuna';
import driverRouter from './routes/Driver';
import rateRouter from './routes/Rate';
import roleRouter from './routes/Role';
import sellRouter from './routes/Sell';
import stopRouter from './routes/Stop';
import userRouter from './routes/User';
import imageRouter from './routes/Images'
import autoRouter from './routes/AddresApi';
import banckRouter from './routes/ApiTransBanck';
import payRouter from './routes/Payment';
import pickUpRouter from './routes/PickUp';
import notificationRouter from './routes/Notification';
import bodyParser from 'body-parser';
import { genAuthUrl } from "./util/generateAuthorizationUrl";
import { oAuth2Callback } from "./util/generateRefreshToken";
import { sequelize } from './models';
import { httpServer, app } from './util/createSocket';
//importaciones router circuit
import circuitRouter from './apiCircuit/router/index';

/* sequelize.sync({ alter: true })
  .then(() => {
    console.log('📦 Todas las tablas fueron sincronizadas correctamente.');
  })
  .catch(error => {
    console.error('❌ Error al sincronizar tablas:', error);
  }); */

//const app = express();

//connectDB();


const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get('/', async (req: Request, res: Response) => {
  res.send('Bienvenido a la api de envios todo santiago');
});
app.get('/config', (req, res) => {
  res.json({ redirectUrl: process.env.POST_VERIFY });
});
app.get('/genAuthUrl', genAuthUrl);
app.get('/oauth2callback', oAuth2Callback);
app.get('/webpay-return', (req, res) => {
  const token_ws = req.query.token_ws;
  const redirectUrl = `appenvios://(tabs)/screen/ProfileScreen?token_ws=${token_ws}`;
  res.send(`
    <html>
      <head><title>Redirigiendo...</title></head>
      <body>
        <script>
          window.location.href = "${redirectUrl}";
        </script>
        <p>Redirigiendo a la app...</p>
      </body>
    </html>
  `);;
});
app.use('/comuna', comunaRouter);
app.use('/driver', driverRouter);
app.use('/rate', rateRouter);
app.use('/role', roleRouter);
app.use('/sell', sellRouter);
app.use('/stop', stopRouter);
app.use('/user', userRouter);
app.use('/image', imageRouter);
app.use('/autocomplete', autoRouter);
app.use('/pay', payRouter);
app.use('/payments', banckRouter);
app.use('/pickUp', pickUpRouter);
app.use('/notification', notificationRouter);
app.use('/circuit', circuitRouter);
app.use(`/uploads`, express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: true }));

httpServer.listen(port, () => {
  console.log(`Servidor disponible en http://localhost:${port}`)
});

export { app };