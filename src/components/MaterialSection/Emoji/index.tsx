import { useContext, useEffect, useState } from "react"
import { Button } from "antd"
import { fabric } from "fabric"
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

import "./index.less"

import { MainContext } from "@/store/useCanvas"


const Emoji = () => {
    const { canvas } = useContext(MainContext)
    const onAddEmoji = (obj: { native: string }) => {
        const emoji = new fabric.Text(obj.native, {
            fontSize: 30,
        })
        canvas?.add(emoji)
        emoji.center()
    }

    return <Picker dynamicWidth={true} previewPosition={"none"} data={data} onEmojiSelect={onAddEmoji} />

}

export default Emoji