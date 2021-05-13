import connection from "../../database/connection";

export const insert = async (entity: unknown, table: any): Promise<any> => {
  try {
    const [id] = await connection.table(table).insert(entity);
    return id;
  } catch (e) {
    console.error(e);
  }
};
