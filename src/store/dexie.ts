import { db } from "@/utils/database"
import { action, computed, makeAutoObservable, observable } from "mobx"


class Dexie {
    snapshotLength: number = 0;
    snapshotCursor: number = -1;

    constructor() {
        makeAutoObservable(this, {
            snapshotLength: observable,
            snapshotCursor: observable
        })
    }


    @computed get canRedo() {
        return this.snapshotCursor < this.snapshotLength - 1
    }
    @computed get canUndo() {
        return this.snapshotCursor > 0
    }

    @action
    setSnapshotLength = (length: number) => {
        this.snapshotLength = length
    }

    @action
    setSnapshotCursor = (cursor: number) => {
        this.snapshotCursor = cursor
    }

    snapshotAdd = async (template: any) => {
        const snapshot = {
            index: this.snapshotLength + 1,
            templates: [template]
        }
        await db.snapshots.add(snapshot)
    }

    // 添加快照
    // const snapshotAdd = async () => {
    //     const snapshot = {
    //         index: snapshotLength + 1,
    //         templates: [canvas?.toJSON() || {} as any]
    //     }
    //     await db.snapshots.add(snapshot)
    // }

    // 删除所有快照
    // const snapshotDel = () => { }

    // 下一步
    // const snapshotRedo = async () => {
    //     if (snapshotCursor >= snapshotLength - 1) return
    //     const nextCursor = snapshotCursor + 1;
    //     setSnapshotCursor(() => { return nextCursor })
    //     const snapshots: Snapshot[] = await db.snapshots.orderBy('id').toArray()
    //     const { index, templates } = snapshots[0]
    //     // const templateIndex = index > templates.length - 1 ? templates.length - 1 : index
    // }

    // 上一步
    //  snapshotUndo = async () => {
    //     const nextSnapshotCursor = snapshotCursor - 1
    //     const snapshots: Snapshot[] = await db.snapshots.orderBy('id').toArray()
    //     const snapshot = snapshots[nextSnapshotCursor]
    //     setCanvas(() => { return snapshot })
    // }

    // // 添加历史快照(历史记录)
    //  addHistorySnapshot = debounce(snapshotAdd, 300, { trailing: true })

    // // 重做
    // const redo = throttle(snapshotRedo, 100, { leading: true, trailing: false })

    // // 撤销
    // const undo = throttle(snapshotUndo, 100, { leading: true, trailing: false })


}

export default Dexie