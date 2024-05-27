// import { useFabricStore, useTemplatesStore } from "@/store";
import { DefaultDPI, DefaultRatio } from "@/configs/size";
import { Padding } from "@/configs/background";
// import { storeToRefs } from "pinia"
import {
  WorkSpaceClipType,
  WorkSpaceDrawType,
  WorkSpaceMaskType,
  WorkSpaceSafeType,
  WorkSpaceClipColor,
  WorkSpaceSafeColor,
  WorkSpaceMaskColor,
  WorkSpaceThumbType,
  WorkSpaceCommonOption,
} from "@/configs/canvas";
import { Line, Group, Rect, Path } from "fabric";
import { LineOption } from "@/types/canvas";
import { TransparentFill } from "@/configs/background";
// import useCanvas from "./useCanvas";
import { ReferenceLine } from "@/extension/object/ReferenceLine";
import { stores } from "@/pages/EditPage/store/main";
