import { useContext, useEffect, useState } from "react";
import { Button } from "antd";
import { FabricText } from "fabric";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { stores as store } from "@/pages/EditPage/store/main";

import "./index.less";

const Emoji = () => {
  const onAddEmoji = (obj: { native: string }) => {
    const emoji = new FabricText(obj.native, {
      fontSize: 30,
      top: 100,
      left: 100,
    });
    store?.canvasStore.addObject(emoji);
    store?.canvasStore.canvas.renderAll();
  };

  return (
    <Picker
      dynamicWidth={true}
      previewPosition={"none"}
      data={data}
      onEmojiSelect={onAddEmoji}
    />
  );
};

export default Emoji;
