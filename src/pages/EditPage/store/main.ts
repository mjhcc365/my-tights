import { action, makeAutoObservable, observable } from "mobx";
import CanvasStore from "./canvas";
import DexieStore from "./dexie";
import Template from "./template";

class MainPage {
  templates: any[] = [];
  curTempIndex: number = 0; // 当前模板
  snapshots: any[] = [];

  constructor() {
    makeAutoObservable(this, {
      templates: observable,
      curTempIndex: observable,
      snapshots: observable,
    });
  }
  @action
  addTemplates = (template: any) => {
    this.templates[this.templates.length] = template;
  };
}

export interface Stores {
  canvasStore: CanvasStore;
  dexieStore: DexieStore;
  mainStore: MainPage;
  template: Template;
}

export const stores: Stores = {
  canvasStore: new CanvasStore(), // canvas的相关操作，fabric的增删改查
  dexieStore: new DexieStore(), // 缓存版本控制相关操作
  mainStore: new MainPage(),
  template: new Template(), // 控制paper的页数，暂时不涉及
};
