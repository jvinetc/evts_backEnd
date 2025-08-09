import express, { Request, Response } from 'express';
import cors from 'cors';
//import { connectDB } from './db/db';
import comunaRouter from './routes/Comuna';
import driverRouter from './routes/Driver';
import rateRouter from './routes/Rate';
import roleRouter from './routes/Role';
import sellRouter from './routes/Sell';
import stopRouter from './routes/Stop';
import userRouter from './routes/User';
import imageRouter from './routes/Images'
import autoRouter from './routes/AddresApi';
import bodyParser from 'body-parser';
//import { genAuthUrl } from "./util/generateAuthorizationUrl";
//import { oAuth2Callback } from "./util/generateRefreshToken";
import { sequelize } from './models';

sequelize.sync({ alter: true })
  .then(() => {
    console.log('📦 Todas las tablas fueron sincronizadas correctamente.');
  })
  .catch(error => {
    console.error('❌ Error al sincronizar tablas:', error);
  });

const app = express();

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
/* app.get('/genAuthUrl', genAuthUrl);
app.get('/oauth2callback', oAuth2Callback); */
app.use('/comuna', comunaRouter);
app.use('/driver', driverRouter);
app.use('/rate', rateRouter);
app.use('/role', roleRouter);
app.use('/sell', sellRouter);
app.use('/stop', stopRouter);
app.use('/user', userRouter);
app.use('/image', imageRouter);
app.use(`/uploads`, express.static("uploads"));
app.use('/autocomplete', autoRouter)
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log(`Servicodr disponible en http://localhost:${port}`)
});