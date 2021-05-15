import { createCharacter, createLicense } from "../utils/Fake";
import { insert } from "./repository/repository";
import { schemaConfig } from "./schema/schema";

export const gamefy = async () => {
  const licenseData_1 = createLicense();
  const licenseId_1 = await insert(licenseData_1, schemaConfig.license);
  const witness_1 = createCharacter(licenseId_1);
  const witnessId_1 = await insert(witness_1, schemaConfig.character);
};
