import { IDriver } from "./Driver";
import { IComuna } from "./Comuna";
import { ISell } from "./Sell";

export interface IStop {
  id?: number,
  addresName?: string,
  addres?: string,
  comunaId?: number,
  phone?: string,
  notes?: string,
  photos?: string,
  status?: string,
  buyOrder?: string,
  sellId?: number,
  driverId?: number,
  rateId?: number,
  ratesIds?: number[],
  totalStop?: number,
  lat?: number,
  lng?: number,
  fragile?: boolean,
  devolution?: boolean,
  evidence?: string[],
  exchange?: boolean;
  pickupDate?: string;
  deliveryDate?: string;
  createAt?: Date,
  updateAt?: Date,
  Sell?: ISell;
}

export interface IStopResponse {
  id?: number,
  addresName?: string,
  addres?: string,
  comunaId?: number,
  phone?: string,
  notes?: string,
  evidence?: string[],
  status?: string,
  buyOrder?: string,
  sellId?: number,
  driverId?: number,
  rateId?: number,
  lat?: number,
  lng?: number,
  fragile?: boolean,
  devolution?: boolean,
  createAt?: Date,
  updateAt?: Date,
  Comuna?: IComuna;
  Sell?: ISell | null | undefined;
  Driver?: IDriver | null | undefined;
  contador?: number;
  exchange?: boolean;
  pickupDate?: string;
  deliveryDate?: string;
}