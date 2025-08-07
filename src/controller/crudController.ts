import { Model, ModelCtor, WhereOptions, ModelStatic } from 'sequelize';

export const create = async <T>(
  model: ModelStatic<Model>,
  data: Partial<T>
): Promise<Model | null> => {
  try {
    return await model.create(data);
  } catch (err) {
    console.error('[Create Error]', err);
    return null;
  }
};

export const update = async <T>(
  model: { update: (data: Partial<T>, config: any) => Promise<any> },
  conditions: Partial<T>,
  newData: Partial<T>
): Promise<boolean> => {
  try {
    const [affectedRows] = await model.update(newData, {
      where: conditions,
    });
    return affectedRows > 0;
  } catch (err) {
    console.error('[Update Error]', err);
    return false;
  }
};

export const list = async <T>(
  model: { findAll: (options?: any) => Promise<T[]> },
  config?: any
): Promise<T[]> => {
  try {
    return await model.findAll(config || {});
  } catch (err) {
    console.error('[List Error]', err);
    return [];
  }
};

export const byField = async <T>(
  model: { findOne: (options: any) => Promise<T | null> },
  condition: Record<string, any>
): Promise<T | null> => {
  try {
    return await model.findOne({
      where: condition,
    });
  } catch (err) {
    console.error('[Find Error]', err);
    return null;
  }
};

export const listWithRelations = async <T>(
  model: { findAll: (options?: any) => Promise<T[]> },
  relations: any[] = [],
  config: any = {}
): Promise<T[]> => {
  try {
    return await model.findAll({
      ...config,
      include: relations,
    });
  } catch (err) {
    console.error('[List Relations Error]', err);
    return [];
  }
};

export const byFieldWithRelations = async <T>(
  model: { findAll: (options: any) => Promise<T | null> },
  condition: Record<string, any>,
  include: any[] = []
): Promise<T | null> => {
  try {
    return await model.findAll({
      where: condition,
      include,
    });
  } catch (err) {
    console.error('[Find Relations Error]', err);
    return null;
  }
};

export const oneByFieldWithRelations = async <T>(
  model: { findOne: (options: any) => Promise<T | null> },
  condition: Record<string, any>,
  include: any[] = []
): Promise<T | null> => {
  try {
    return await model.findOne({
      where: condition,
      include,
    });
  } catch (err) {
    console.error('[Find Relations Error]', err);
    return null;
  }
};

export const updateByRelationField = async <T>(
  model: { update: (data: Partial<T>, config: any) => Promise<any> },
  field: keyof T,
  value: T[keyof T],
  data: Partial<T>
): Promise<boolean> => {
  try {
    const [affected] = await model.update(data, {
      where: { [field]: value },
    });
    return affected > 0;
  } catch (err) {
    console.error('[Update Relation Error]', err);
    return false;
  }
};

export const remove = async <T>(
  model: { destroy: (config: any) => Promise<any> },
  conditions: Partial<T>
): Promise<boolean> => {
  try {
    const affectedRows = await model.destroy({
      where: conditions,
    });
    return affectedRows > 0;
  } catch (err) {
    console.error('[Remove Error]', err);
    return false;
  }
};