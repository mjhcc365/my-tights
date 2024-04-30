import * as fabric from "fabric";

// Change the size of the target object
export const changeSizeUtils = function (
  eventData: Event,
  transform: fabric.Transform,
  x: number,
  y: number
) {
  let target = transform.target,
    strokeWidth = target.strokeWidth || 0,
    localPoint = fabric.controlsUtils.getLocalPoint(
      transform,
      transform.originX,
      transform.originY,
      x,
      y
    ),
    strokePaddingX = strokeWidth / (target.strokeUniform ? target.scaleX! : 1),
    strokePaddingY = strokeWidth / (target.strokeUniform ? target.scaleY! : 1),
    multiplier = 2,
    oldWidth = target.width,
    newWidth =
      Math.abs((localPoint.x * multiplier) / target.scaleX!) - strokePaddingX,
    oldHeight = target.height,
    newHeight =
      Math.abs((localPoint.y * multiplier) / target.scaleY!) - strokePaddingY;
  target.set("width", Math.max(newWidth, 0));
  target.set("height", Math.max(newHeight, 0));
  return oldWidth !== newWidth || oldHeight !== newHeight;
};
