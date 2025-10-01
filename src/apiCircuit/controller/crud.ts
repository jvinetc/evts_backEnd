import { ModelStatic, FindOptions, WhereOptions } from 'sequelize';

export const insert = async <T>(model: ModelStatic<any>, data: Partial<T>): Promise<T> => {
  return await model.create(data);
};

export const find = async <T>(
  model: ModelStatic<any>,
  where?: WhereOptions,
  options?: FindOptions
): Promise<T[]> => {
  return await model.findAll({ where, ...options });
};

export const findOne = async <T>(
  model: ModelStatic<any>,
  where: WhereOptions,
  options?: FindOptions
): Promise<T | null> => {
  return await model.findOne({ where, ...options });
};

export const update = async <T>(
  model: ModelStatic<any>,
  id: number,
  data: Partial<T>
): Promise<T | null> => {
  const instance = await model.findByPk(id);
  if (!instance) return null;
  await instance.update(data);
  return instance;
};

export const remove = async <T>(
  model: ModelStatic<any>,
  id: number
): Promise<boolean> => {
  const instance = await model.findByPk(id);
  if (!instance) return false;
  await instance.destroy();
  return true;
};