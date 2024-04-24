import { Textbox, Circle, Group } from "fabric";

export const fabricRender = (obj: any) => {
  switch (obj.type) {
    case "textbox":
      return new Textbox(obj.text, { ...obj });
    case "circle":
      return new Circle({ ...obj });
    case "group":
      return fabricRenderJson(obj.objects, { ...obj });
    default:
      break;
  }
};

export const fabricRenderJson = (objects: any, options?: any) => {
  const group = new Group(undefined, options);
  (objects || []).map((ele: any) => {
    // group.add(fabricRender(ele));
  });
  return group;
};
