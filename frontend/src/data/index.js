import { applyCatalogDiscount } from "./pricing.js";

import { washingMachineCleanerPro as washingMachineCleanerProRaw } from "./products/washingMachineCleanerPro.js";
import { lintPro as lintProRaw } from "./products/lintPro.js";
import { groomingGloves as groomingGlovesRaw } from "./products/groomingGloves.js";
import { petGroomingKit as petGroomingKitRaw } from "./products/petGroomingKit.js";
import { cleanerPetHairGlove as cleanerPetHairGloveRaw } from "./products/cleanerPetHairGlove.js";
import { cleanerGloveProBundle as cleanerGloveProBundleRaw } from "./products/cleanerGloveProBundle.js";
import { moldStainRemover as moldStainRemoverRaw } from "./products/moldStainRemover.js";
import { laundryCyclePro as laundryCycleProRaw } from "./products/laundryCyclePro.js";
import { deepCleanKit2 as deepCleanKit2Raw } from "./products/deepCleanKit2.js";
import { washingMachineCleanerUltra as washingMachineCleanerUltraRaw } from "./products/washingMachineCleanerUltra.js";

/** All catalog products with a consistent ~20% sale vs previous price. */
export const washingMachineCleanerPro = applyCatalogDiscount(washingMachineCleanerProRaw);
export const lintPro = applyCatalogDiscount(lintProRaw);
export const groomingGloves = applyCatalogDiscount(groomingGlovesRaw);
export const petGroomingKit = applyCatalogDiscount(petGroomingKitRaw);
export const cleanerPetHairGlove = applyCatalogDiscount(cleanerPetHairGloveRaw);
export const cleanerGloveProBundle = applyCatalogDiscount(cleanerGloveProBundleRaw);
export const moldStainRemover = applyCatalogDiscount(moldStainRemoverRaw);
export const laundryCyclePro = applyCatalogDiscount(laundryCycleProRaw);
export const deepCleanKit2 = applyCatalogDiscount(deepCleanKit2Raw);
export const washingMachineCleanerUltra = applyCatalogDiscount(washingMachineCleanerUltraRaw);

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
  washingMachineCleanerUltra,
];

export default product;
