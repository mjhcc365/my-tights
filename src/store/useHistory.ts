import { debounce, throttle } from 'lodash'
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/utils/database"
import { useContext, useState } from 'react';
import { MainContext } from './useCanvas';


export interface ScreenState {
    snapshotCursor: number
    snapshotLength: number
}

export interface Snapshot {
    index: number
    templates: any[]
}

const useHistory = () => {

    const { canvas, setCanvas } = useContext(MainContext)

    const [canUndo, setCanUndo] = useState<boolean>(false);
    const [canRedo, setCanRedo] = useState<boolean>(false);
    const [snapshotLength, setSnapshotLength] = useState<number>(0)
    const [snapshotCursor, setSnapshotCursor] = useState<number>(-1)

    // 添加快照
    const snapshotAdd = async () => {
        const snapshot = {
            index: snapshotLength + 1,
            templates: [canvas?.toJSON() || {} as any]
        }
        await db.snapshots.add(snapshot)
    }

    // 删除所有快照
    const snapshotDel = () => { }

    // 下一步
    const snapshotRedo = async () => {
        if (snapshotCursor >= snapshotLength - 1) return
        const nextCursor = snapshotCursor + 1;
        setSnapshotCursor(() => { return nextCursor })
        const snapshots: Snapshot[] = await db.snapshots.orderBy('id').toArray()
        const { index, templates } = snapshots[0]
        // const templateIndex = index > templates.length - 1 ? templates.length - 1 : index
    }

    // 上一步
    const snapshotUndo = async () => {
        const nextSnapshotCursor = snapshotCursor - 1
        const snapshots: Snapshot[] = await db.snapshots.orderBy('id').toArray()
        const snapshot = snapshots[nextSnapshotCursor]
        setCanvas(() => { return snapshot })
    }

    // 添加历史快照(历史记录)
    const addHistorySnapshot = debounce(snapshotAdd, 300, { trailing: true })

    // 重做
    const redo = throttle(snapshotRedo, 100, { leading: true, trailing: false })

    // 撤销
    const undo = throttle(snapshotUndo, 100, { leading: true, trailing: false })

    return {
        canUndo,
        canRedo,
        addHistorySnapshot,
        redo,
        undo
    }

}

export default useHistory