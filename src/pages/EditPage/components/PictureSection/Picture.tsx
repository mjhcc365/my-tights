import axios from "axios";
import { useLayoutEffect, useState, useRef, useEffect } from "react";
import { debounce } from "lodash";

import { LoadUnsplashHelper, LoadCollectionsHelper } from "./loadHelp";

const img_keywords = ["black", "yellow", "orange", "blue", "red", "green"];

const PictureLine = (props: { keywords: string | undefined }) => {
  const { keywords } = props;
  const helper = new LoadUnsplashHelper(keywords || "", 3);
  const [curImgs, setCurImgs] = useState([]);

  useEffect(() => {
    // helper.loadMoreData()?.then((res: any) => {
    //   setCurImgs(() => res?.data || []);
    // });
  }, []);

  return (
    <>
      {curImgs.map((ele: any) => {
        return (
          <div key={ele} className="flex-1">
            <img
              src={ele?.urls?.small}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                aspectRatio: `${ele.width / ele.height}`,
                backgroundColor: ele?.color,
              }}
            />
          </div>
        );
      })}
    </>
  );
};

const PictureWaterfalls = (props: { keyword: string | undefined }) => {
  const { keyword } = props;
  const [curImgs, setCurImgs] = useState([]);

  const loadHelper = new LoadUnsplashHelper(keyword || "");

  const domRef = useRef(null);

  const handleLoadMore = debounce(async () => {
    const res: any = await loadHelper.loadMoreData();
    setCurImgs((preValue) => preValue.concat(res?.data || []));
  }, 2000);

  useLayoutEffect(() => {
    handleLoadMore();
    window?.addEventListener("scroll", handleLoadMore, true);
    return () => {
      window?.removeEventListener("scroll", handleLoadMore, true);
    };
  }, []);

  return (
    <div
      style={{
        height: "calc(100vh - 150px)",
      }}
      className="overflow-y-scroll"
    >
      <div ref={domRef} className="grid grid-cols-2 gap-2">
        {curImgs.map((ele: any) => {
          return (
            <div key={ele} className="col-span-1 border">
              {/* <img
                src={ele?.urls?.small}
                style={{
                  width: "100%",
                  height: "100%",
                  aspectRatio: `${ele.width / ele.height}`,
                  backgroundColor: ele?.color,
                }}
              /> */}
            </div>
          );
        })}
      </div>
      <div className="my-4">加载中...</div>
    </div>
  );
};

// 实现懒加载和虚拟列表

const Picture = () => {
  const [isMore, setIsMore] = useState<boolean>(false);
  const [curKeyword, setCurKeyword] = useState<string | undefined>(undefined);
  const [collections, setCollections] = useState([]);

  const loadCollectionsHelper = new LoadCollectionsHelper();

  const onViewMore = (k: string) => {
    setCurKeyword(() => k);
    setIsMore(() => true);
  };

  const handleLoadCollections = () => {
    loadCollectionsHelper.loadCollections()?.then((res: any) => {
      setCollections(() => res?.data);
    });
  };

  useEffect(() => {
    handleLoadCollections();
  }, []);

  return (
    <div>
      {!isMore && (
        <div
          style={{
            height: "calc(100vh - 120px)",
          }}
          className=" overflow-y-scroll"
        >
          <div className="grid grid-cols-2 gap-2">
            {collections.map((ele: any) => {
              const { title = "", preview_photos = [], tags = [], color } = ele;
              const { urls } = ele?.cover_photo;
              return (
                <section
                  key={urls?.thumb}
                  style={{
                    aspectRatio: 10 / 7,
                  }}
                  className="col-span-2  grid grid-rows-3 cursor-pointer"
                >
                  <div
                    style={{
                      backgroundColor: color,
                    }}
                    className="grid grid-rows-2 grid-cols-3 row-span-2 gap-1 rounded-md overflow-hidden"
                  >
                    <img
                      src={preview_photos[0]?.urls?.thumb}
                      className="col-span-2 row-span-2 h-full w-full object-cover"
                    />
                    <img
                      src={preview_photos[1]?.urls?.thumb}
                      className="col-span-1 row-span-1 h-full w-full object-cover"
                    />
                    <img
                      src={preview_photos[2]?.urls?.thumb}
                      className="col-span-1 row-span-1 h-full w-full object-cover"
                    />
                  </div>
                  <div className="row-span-1  ">
                    <div>{title}</div>
                    <div className="flex gap-2">
                      {tags.slice(0, 3).map((t: any) => {
                        return (
                          <span
                            key={t?.title}
                            className="px-2 rounded-md bg-slate-100"
                          >
                            {t?.title}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      )}

      {isMore && (
        <div>
          <div
            onClick={() => {
              setIsMore(() => false);
            }}
            className="mb-2 text-left cursor-pointer"
          >
            {`< 返回`}
          </div>
          <PictureWaterfalls keyword={curKeyword} />
        </div>
      )}
    </div>
  );
};

export default Picture;
