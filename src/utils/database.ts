import Dexie, { Table } from "dexie";

export interface WorkSpaceElement {
  fill?: string;
  left: number;
  top: number;
  fillType: number;
  angle: number;
  scaleX: number;
  scaleY: number;
  color?: string;
  opacity?: number;
  imageURL?: string;
  imageSize?: "cover" | "contain" | "repeat";
  gaidImageURL?: string;
  gaidImageMode?: string;
  shadingImageURL?: string;
  gradientType?: "linear" | "radial";
  gradientName?: string;
  // gradientColor?: ColorStop[]
  gradientRotate?: number;
  backgroundColor?: string;
}

export interface Template {
  id: string;
  version: string;
  workSpace: WorkSpaceElement;
  background?: string;
  backgroundImage?: any;
  zoom: number;
  width: number;
  height: number;
  clip: number;
  objects: fabric.Object[];
}

export interface Snapshot {
  index: number;
  templates: Template[];
}

export class MySubClassedDexie extends Dexie {
  snapshots!: Table<Snapshot, number>;

  constructor() {
    super(`hbs-datebase-${new Date().getTime()}`);
    this.deleteDiscardedDB();
    this.version(1).stores({
      snapshots: "++id",
    });
    this.snapshots = this.table("snapshots");
  }

  deleteDiscardedDB = async () => {
    const dbNames = await Dexie.getDatabaseNames();
    dbNames.forEach((ele) => {
      Dexie.delete(ele);
    });
  };
}

export const db = new MySubClassedDexie();
