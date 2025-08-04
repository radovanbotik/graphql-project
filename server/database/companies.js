import DataLoader from "dataloader";
import { connection } from "./connection.js";

const getCompanyTable = () => connection.table("company");

export async function getCompany(id) {
  return await connection.table("company").first().where({ id: id });
}

//It collects all the company IDs needed in a single execution cycle (e.g., [1, 2, 3, 4]).
//Then runs ONE database query like:
//SELECT * FROM company WHERE id IN (1, 2, 3, 4)
//Since SQL results are not guaranteed to be in the same order as the IDs, the line:
//return ids.map(id => companies.find(company => company.id === id));

//handle caching, make sure that the data is not cached forever
export function createCompanyLoader() {
  return new DataLoader(async ids => {
    const companies = await getCompanyTable().select().whereIn("id", ids);
    return ids.map(id => companies.find(company => company.id === id));
  });
}
