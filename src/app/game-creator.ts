import { createCharacter, createLicense } from "../utils/Fake";
import { insert } from "./repository/repository";
import { schemaConfig } from "./schema/schema";

export const gamefy = async () => {
  const licenseData = createLicense();
  const licenseId = await insert(licenseData, schemaConfig.license);

  console.log(licenseId);

  const witness_1 = createCharacter(licenseId);
  console.log(witness_1);
};
