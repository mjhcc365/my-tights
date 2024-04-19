import { action, computed, makeAutoObservable, observable } from "mobx";

class Template {
    templates: any[] = []
    templateIndex: number = 0
    constructor() {
        makeAutoObservable(this, {
            templates: observable,
            templateIndex: observable
        })
    }

    @computed get curTemplates() {
        return this.templates[this.templateIndex]
    }

    @action
    changeTemplates = () => {
    }
}

export default Template