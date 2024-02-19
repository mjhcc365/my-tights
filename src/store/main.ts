import { action, makeAutoObservable, observable } from "mobx"
import CanvasStore from "./canvas"
import DexieStore from "./dexie";

class MainPage {
    templates: any[] = [];
    curTempIndex: number = 0; // 当前模板
    snapshots: any[] = []

    constructor() {
        makeAutoObservable(this, {
            templates: observable,
            curTempIndex: observable,
            snapshots: observable
        })
    }

    @action
    addTemplates = (template: any) => {
        this.templates[this.templates.length] = template
    }
}


export interface Stores {
    canvasStore: CanvasStore;
    dexieStore: DexieStore;
    mainStore: MainPage;
}

export const stores: Stores = {
    canvasStore: new CanvasStore(),
    dexieStore: new DexieStore(),
    mainStore: new MainPage(),
};

