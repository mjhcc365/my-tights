import { fabric } from "fabric";
import { Input } from "antd";
import { useMemo, useState } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas, IconPack } from "@fortawesome/free-solid-svg-icons"; // ES Module "as" syntax
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// import { rilis } from "./calendar";
import { stores as store } from "@/store/main";

library.add(fas, far, fab);

const libraryObj: Record<string, IconPack> = {
  fabname: fab,
  farname: far,
  fasname: fas,
};

const SubIconArray = (props: { search: string; libraryName: string }) => {
  const { search, libraryName } = props;
  const onAddSVG = (iconname: any) => {
    const node: Element | null = document.querySelector(`.fa-${iconname}`);
    fabric.loadSVGFromString(node?.outerHTML || "", (objects, options) => {
      // store?.canvasStore.canvas?.add(node?.src).renderAll();
      const svgObjects = fabric.util.groupSVGElements(objects, options);
      svgObjects.set({
        left: 100,
        top: 100,
        scaleX: 0.5,
        scaleY: 0.5,
      });
      store?.canvasStore.canvas?.add(svgObjects).renderAll();
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
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5,1fr)",
        flexWrap: "wrap",
        gap: "4px",
      }}
    >
      {iconArray.slice(0, 200).map((ele) => {
        return (
          <div
            key={ele}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <FontAwesomeIcon
              style={{
                width: 36,
                height: 28,
                color: "grey",
                cursor: "pointer",
              }}
              icon={[
                `${libraryName.slice(0, 3)}` as any,
                libraryObj[libraryName][ele]?.iconName,
              ]}
              onClick={(e) => {
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

  // const onAddIcon = (param: any) => {
  //   fabric.loadSVGFromURL(rilis[param], (objects, options) => {
  //     store?.canvasStore.canvas?.add(objects[0]).renderAll();
  //   });
  // };

  return (
    <div>
      <div
        style={{
          marginBottom: "8px",
        }}
      >
        <Input value={search} onChange={onSearchChange} />
      </div>
      <div
        style={{
          height: "calc(100vh - 220px)",
          overflowY: "scroll",
        }}
      >
        {Object.keys(libraryObj).map((ele) => {
          return <SubIconArray key={ele} search={search} libraryName={ele} />;
        })}
        {/* <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "4px",
          }}
        >
          {rilis.map((ele, index) => {
            return (
              <div
                key={ele}
                style={{
                  width: 36,
                  height: 28,
                }}
                onClick={() => {
                  onAddIcon(index);
                }}
              >
                <img src={ele} style={{ width: 24, height: 24 }} />
              </div>
            );
          })}
        </div> */}
      </div>
    </div>
  );
};

export default IconEditor;
