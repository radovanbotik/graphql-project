import { connection } from "./connection.js";

export async function getCompany(id) {
  return await connection.table("company").first().where({ id: id });
}
