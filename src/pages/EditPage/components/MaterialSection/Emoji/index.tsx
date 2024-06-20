import { useContext } from "react";
import { FabricText } from "fabric";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { observer } from "mobx-react-lite";
import { CanvasStoreContext } from "@/store/canvas";
import "./index.less";

const Emoji = () => {
  const store = useContext(CanvasStoreContext);
  const onAddEmoji = (obj: { native: string }) => {
    const emoji = new FabricText(obj.native, {
      fontSize: 30,
    });
    store.addObject(emoji);
    store.canvas.renderAll();
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

export default observer(Emoji);
