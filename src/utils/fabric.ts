import { fabric } from "fabric";

export const fabricRender=(obj:any)=>{
  switch (obj.type) {
    case "textbox":
      return new fabric.Textbox(obj.text,{...obj})
    case "circle":
      return new fabric.Circle({...obj})
    case "group":
      return fabricRenderJson(obj.objects,{...obj})
    default:
      break;
  }
}

export const fabricRenderJson = (objects: any,options?:any) => {
    const group = new fabric.Group(undefined,options);
    (objects||[]).map((ele: any) => {
      group.addWithUpdate(fabricRender(ele)) 
    });
    return group;
  };