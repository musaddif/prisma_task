import { usStates } from "./usStates.js";
import { stateZipPrefixes } from "./stateZipPrefixes.js";

import { washingMachineCleanerPro } from "./products/washingMachineCleanerPro.js";
import { lintPro } from "./products/lintPro.js";
import { groomingGloves } from "./products/groomingGloves.js";
import { petGroomingKit } from "./products/petGroomingKit.js";
import { cleanerPetHairGlove } from "./products/cleanerPetHairGlove.js";
import { cleanerGloveProBundle } from "./products/cleanerGloveProBundle.js";
import { moldStainRemover } from "./products/moldStainRemover.js";
import { laundryCyclePro } from "./products/laundryCyclePro.js";
import { deepCleanKit2 } from "./products/deepCleanKit2.js";
import { washingMachineCleanerUltra } from "./products/washingMachineCleanerUltra.js";

export {
  washingMachineCleanerPro,
  lintPro,
  groomingGloves,
  petGroomingKit,
  cleanerPetHairGlove,
  cleanerGloveProBundle,
  moldStainRemover,
  laundryCyclePro,
  deepCleanKit2,
  washingMachineCleanerUltra,
};

export const product = [
  washingMachineCleanerPro,
  lintPro,
  groomingGloves,
  petGroomingKit,
  cleanerPetHairGlove,
  cleanerGloveProBundle,
  moldStainRemover,
  laundryCyclePro,
  deepCleanKit2,
  washingMachineCleanerUltra
];

export const getProductById = (id) => product.find((p) => p.id === Number(id));
export const getProductByHandle = (handle) => product.find((p) => p.handle === handle);

export { usStates, stateZipPrefixes };

export default product;
