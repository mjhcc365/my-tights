import { Canvas } from "fabric";
import * as fabric from "fabric";

export class FabricCanvas extends Canvas {
  interactiveMode: string = "selection";
  _handModeData?: {
    state: string;
    dragCursorPosition: {
      y: number;
      x: number;
    };
  };
  originalHeight: number;
  constructor() {
    super();
  }

  disableSelection = () => {
    this.selection = false;
  };
  enableSelection = () => {
    if (this.interactiveMode === "selection") {
      return;
    }
    this.interactiveMode = "selection";
    this.disablePanning();
    this.disableDrawing();
    this.selection = true;
  };

  disablePanning = () => {
    // @ts-ignore
    this.off("mouse:down", this._handModeMouseDown);
    // @ts-ignore
    this.off("mouse:move", this._handModeMouseMove);
    this.off("mouse:up", this._handModeMouseUp);
  };
  _handModeMouseMove = (e: fabric.TEvent<MouseEvent>) => {
    if (this._activeObject) {
      return;
    }
    if (!this._handModeData) {
      return;
    }
    let event = e.e;
    this._handModeData.state = "move";

    if (
      event.pageY === this._handModeData.dragCursorPosition.y &&
      event.pageX === this._handModeData.dragCursorPosition.x
    ) {
      return;
    }

    let scroll = {
      x: this.viewportTransform[4],
      y: this.viewportTransform[5],
    };

    let newScroll = {
      x: scroll.x - (this._handModeData.dragCursorPosition.x - event.pageX),
      y: scroll.y - (this._handModeData.dragCursorPosition.y - event.pageY),
    };
    let zoom = this.getZoom();
    if (newScroll.y > this.height / 2) {
      newScroll.y = this.height / 2;
    }
    if (newScroll.x > this.width / 2) {
      newScroll.x = this.width / 2;
    }
    if (newScroll.y < this.height / 2 - this.getOriginalHeight() * zoom - 10) {
      newScroll.y = this.height / 2 - this.getOriginalHeight() * zoom - 10;
    }
    if (newScroll.x < this.width / 2 - this.getOriginalWidth() * zoom - 10) {
      newScroll.x = this.width / 2 - this.getOriginalWidth() * zoom - 10;
    }

    this.viewportTransform[4] = newScroll.x;
    this.viewportTransform[5] = newScroll.y;

    this.fire("viewport:translate", {
      x: this.viewportTransform[4],
      y: this.viewportTransform[5],
    });

    this.renderAll();
    for (let i = 0, len = this._objects.length; i < len; i++) {
      this._objects[i].setCoords();
    }

    this._handModeData.dragCursorPosition.y = event.pageY;
    this._handModeData.dragCursorPosition.x = event.pageX;
  };
  _handModeMouseUp = () => {
    delete this._handModeData;
  };

  _handModeMouseDown = (e: fabric.TEvent<MouseEvent>) => {
    if (this._activeObject) {
      return;
    }
    let event = e.e;
    this._handModeData = {
      state: "down",
      dragCursorPosition: {
        y: event.pageY,
        x: event.pageX,
      },
    };
  };

  getOriginalHeight = () => {
    return this.originalHeight || this.height || 0;
  };
}
