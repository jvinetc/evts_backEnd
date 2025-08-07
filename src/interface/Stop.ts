
export interface IStop {
  id?: number,
  addresName: string,
  addres: string,
  comunaId: number,
  phone: string,
  notes?: string,
  photos?: string,
  status: string,
  sellId: number,
  driverId?: number,
  rateId: number,
  createAt: Date,
  updateAt?: Date,
}