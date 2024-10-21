import { useMemo } from "react";

import allAmbassadors, {
  type Ambassador,
} from "@alveusgg/data/src/ambassadors/core";
import {
  isActiveAmbassadorKey as isAmbassadorKey,
  isActiveAmbassadorEntry,
  type ActiveAmbassadors as Ambassadors,
  type ActiveAmbassadorKey as AmbassadorKey,
} from "@alveusgg/data/src/ambassadors/filters";
import { getClassification } from "@alveusgg/data/src/ambassadors/classification";
import {
  getAmbassadorImages,
  type AmbassadorImage,
} from "@alveusgg/data/src/ambassadors/images";
import { getIUCNStatus } from "@alveusgg/data/src/iucn";

import { typeSafeObjectEntries } from "./helpers";
import { sortDate } from "./dateManager";

const sortedAmbassadors = typeSafeObjectEntries(allAmbassadors)
  .filter(isActiveAmbassadorEntry)
  .sort(([, a], [, b]) => sortDate(a.arrival, b.arrival));

export const useAmbassadors = () => sortedAmbassadors;

export const useAmbassador = (key: AmbassadorKey): Ambassadors[typeof key] =>
  useMemo(() => sortedAmbassadors.find(([k]) => k === key)![1], [key]);

export {
  isAmbassadorKey,
  getClassification,
  getAmbassadorImages,
  getIUCNStatus,
  type Ambassadors,
  type AmbassadorKey,
  type Ambassador,
  type AmbassadorImage,
};
