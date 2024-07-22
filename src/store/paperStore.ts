// @ts-nocheck
import { makeObservable, observable } from "mobx";

import {
  PaperTempType,
  PaperConfig,
} from "@/pages/EditPage/components/SizeSection/usePaperStore";

export class PaperStore {
  paperConfig: PaperConfig = {} as unknown as PaperConfig;
  constructor(initConfig: PaperConfig) {
    makeObservable(this, {
      paperConfig: observable,
    });
    this.paperConfig = initConfig;
  }

  updatePaperConfig(key, value) {
    this.paperConfig[key] = value;
  }
}
