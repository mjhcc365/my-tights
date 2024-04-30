import * as fabric from "fabric";
import { changeSizeUtils } from "./Util";

let fabricRectMixin: any = {
  /**
   * customizable FabricJS properties
   */
  stroke: "#582fbe",
  cornerColor: "#582fbe",
  fill: "rgba(88,47,190,0.2)",
  strokeWidth: 2,
  strokeUniform: true,
  noScaleCache: false,
  connections: null,
  _connections: null,

  transparentCorners: false,
  originX: "left",
  originY: "top",
  cornerSize: 8,
  lockRotation: true,

  initialize(options: fabric.IRectOptions) {
    this.callSuper("initialize", options);
    this.controls = this._getControls();
    delete this.controls["mr"];
    delete this.controls["ml"];
    delete this.controls["mt"];
    delete this.controls["mb"];
    delete this.controls["mtr"];
  },

  // Retrieves the controls for the table
  _getControls() {
    //@ts-ignore
    let cursorStyleHandler = fabric.controlsUtils.scaleCursorStyleHandler;
    let changeSize = changeSizeUtils;
    //@ts-ignore
    let dragHandler = fabric.controlsUtils.dragHandler;

    return {
      tl: new fabric.Control({
        x: -0.5,
        y: -0.5,
        cursorStyleHandler,
        actionHandler: changeSizeUtils,
      }),
      tr: new fabric.Control({
        x: 0.5,
        y: -0.5,
        cursorStyleHandler,
        actionHandler: changeSizeUtils,
      }),
      bl: new fabric.Control({
        x: -0.5,
        y: 0.5,
        cursorStyleHandler,
        actionHandler: changeSizeUtils,
      }),
      br: new fabric.Control({
        x: 0.5,
        y: 0.5,
        cursorStyleHandler,
        actionHandler: changeSizeUtils,
      }),
    };
  },
  toObject(propertiesToInclude: string[]) {
    return this.callSuper(
      "toObject",
      ["id", "connections"].concat(propertiesToInclude)
    );
  },
};
Object.assign(fabric.Rect.prototype, fabricRectMixin);

/**
 * Augment declarations to add custom methods to fabric.Canvas interface
 */
declare module "fabric" {
  namespace fabric {
    interface IRectOptions {
      text?: string;
    }
    interface Rect {
      text?: string;
    }
  }
}
