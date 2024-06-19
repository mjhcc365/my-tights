import { loadSVGFromString, util } from "fabric";
import { Input } from "antd";
import { useMemo, useState } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas, IconPack } from "@fortawesome/free-solid-svg-icons"; // ES Module "as" syntax
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// import { rilis } from "./calendar";
import { stores as store } from "@/pages/EditPage/store/main";

library.add(fas, far, fab);

const libraryObj: Record<string, IconPack> = {
  farname: far,
  fabname: fab,
  fasname: fas,
};

const SubIconArray = (props: { search: string; libraryName: string }) => {
  const { search, libraryName } = props;
  const onAddSVG = (iconname: any) => {
    const node: Element | null = document.querySelector(`.fa-${iconname}`);
    loadSVGFromString(node?.outerHTML || "").then((ele) => {
      const svgObjects = util.groupSVGElements(ele.objects, ele.options);
      const { x = 100, y = 100 } = store.canvasStore.getCenterPoint();
      svgObjects.set({
        scaleX: 0.05,
        scaleY: 0.05,
        top: y - 50,
        left: x,
        fill: "grey",
      });
      store?.canvasStore.addObject(svgObjects);
    });
  };
  const iconArray = useMemo(() => {
    return search === ""
      ? Object.keys(libraryObj[libraryName])
      : Object.keys(libraryObj[libraryName]).filter((key) =>
          key.includes(search.toLowerCase())
        );
  }, [search]);
  return (
    <div className="border grid grid-cols-5 gap-4 overflow-y-scroll  rounded-lg">
      {iconArray.map((ele) => {
        return (
          <div key={ele} className="col-span-1 flex flex-col">
            <FontAwesomeIcon
              style={{
                width: 32,
                height: 28,
                color: "grey",
                cursor: "pointer",
              }}
              icon={[
                `${libraryName.slice(0, 3)}` as any,
                libraryObj[libraryName][ele]?.iconName,
              ]}
              onClick={() => {
                onAddSVG(libraryObj[libraryName][ele]?.iconName);
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

const IconEditor = () => {
  const [search, setSearch] = useState<string>("");

  const onSearchChange = (str: any) => {
    setSearch(() => str.target.value);
  };

  return (
    <div>
      <div>
        <Input value={search} onChange={onSearchChange} />
      </div>
      {
        <div
          style={{
            height: "calc(100vh - 200px)",
          }}
          className="grid grid-rows-3 gap-4 mt-2 "
        >
          {Object.keys(libraryObj).map((ele) => {
            return <SubIconArray key={ele} search={search} libraryName={ele} />;
          })}
        </div>
      }
    </div>
  );
};

export default IconEditor;
