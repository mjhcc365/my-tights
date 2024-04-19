import { useLayoutEffect, useState, useRef, useEffect } from "react";
import { debounce } from "lodash";
import { LoadUnsplashHelper, LoadCollectionsHelper } from "./loadHelp";

const PictureWaterfalls = (props: {
  viewmore: boolean;
  keyword: string | undefined;
  onCloseViewMore: () => void;
}) => {
  const { viewmore, keyword, onCloseViewMore } = props;
  const [curImgs, setCurImgs] = useState([]);

  const loadHelper = new LoadUnsplashHelper(keyword || "");

  const domRef = useRef(null);

  const handleLoadMore = debounce(async () => {
    const res: any = await loadHelper.loadMoreData();
    setCurImgs((preValue) => preValue.concat(res?.data || []));
  }, 2000);

  const onScroll = () => {
    const top = (domRef.current as any)?.getBoundingClientRect().top;
    if (top <= window.innerHeight + 100) {
      handleLoadMore();
    }
  };

  useLayoutEffect(() => {
    handleLoadMore();
    window?.addEventListener("scroll", onScroll, true);
    return () => {
      window?.removeEventListener("scroll", onScroll, true);
    };
  }, []);

  return (
    <div
      style={{
        visibility: viewmore ? "visible" : "hidden",
      }}
    >
      <div onClick={onCloseViewMore} className="mb-2 text-left cursor-pointer">
        {`< 返回`}
      </div>
      <div
        style={{
          height: "calc(100vh - 150px)",
        }}
        className="overflow-y-scroll"
      >
        <div ref={domRef} className="grid grid-cols-2 gap-2">
          {curImgs.map((ele: any) => {
            return (
              <div key={ele} className="col-span-1 ">
                <img
                  src={ele?.urls?.small}
                  style={{
                    aspectRatio: `${ele.width / ele.height}`,
                    backgroundColor: ele?.color,
                  }}
                  className="w-full h-full rounded-md"
                />
              </div>
            );
          })}
        </div>
        <div className="my-4">加载中...</div>
      </div>
    </div>
  );
};

const PictureCollections = (props: {
  viewmore: boolean;
  onViewMore: (k: string) => void;
}) => {
  const { onViewMore, viewmore } = props;
  const domRef = useRef(null);

  const [collections, setCollections] = useState([]);

  const loadCollectionsHelper = new LoadCollectionsHelper();

  const handleLoadCollections = debounce(() => {
    loadCollectionsHelper.loadCollections()?.then((res: any) => {
      setCollections((preValue) => preValue.concat(res?.data || []));
    });
  }, 2000);

  const onScroll = () => {
    const top = (domRef.current as any)?.getBoundingClientRect().top;
    if (top <= window.innerHeight + 100) {
      handleLoadCollections();
    }
  };

  useEffect(() => {
    handleLoadCollections();
    window?.addEventListener("scroll", onScroll, true);
    return () => {
      window?.removeEventListener("scroll", onScroll, true);
    };
  }, []);
  return (
    <div
      style={{
        height: "calc(100vh - 120px)",
      }}
      className="overflow-y-scroll"
      ref={domRef}
    >
      <div className="grid grid-cols-2 gap-2">
        {collections.map((ele: any) => {
          const { title = "", preview_photos = [], tags = [], color, id } = ele;
          const { urls } = ele?.cover_photo;
          return (
            <section
              key={urls?.thumb}
              style={{
                aspectRatio: 10 / 7,
              }}
              className="col-span-2 grid grid-rows-3 cursor-pointer"
              onClick={() => {
                onViewMore(id);
              }}
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
  );
};

const Picture = () => {
  const [isMore, setIsMore] = useState<boolean>(false);
  const [curKeyword, setCurKeyword] = useState<string | undefined>(undefined);

  const onViewMore = (k: string) => {
    setCurKeyword(() => k);
    setIsMore(() => true);
  };

  return (
    <div>
      {!isMore && (
        <PictureCollections viewmore={isMore} onViewMore={onViewMore} />
      )}
      {isMore && (
        <PictureWaterfalls
          onCloseViewMore={() => {
            setIsMore(() => false);
          }}
          keyword={curKeyword}
          viewmore={isMore}
        />
      )}
    </div>
  );
};

export default Picture;
