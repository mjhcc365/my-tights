import { Button } from "antd";
import { stores as store } from "@/pages/EditPage/store/main";
import axios from "axios";
import { useEffect, useState } from "react";

const img_keywords = [
  "black_and_white",
  "black",
  "white",
  "yellow",
  "orange",
  "blue",
  "red",
  "green",
];

const imgs = [
  "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1712698396006-1996dc7cb2cc",
  "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1712081024194-bd8d6af8fd68",
  "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1711997632197-e09b5c59605d",
];

const PictureLine = (props: { keywords: string }) => {
  const { keywords } = props;

  const [curImgs, setCurImgs] = useState([]);

  const handleGetIMG = () => {
    const ACCESS_KEY = "pV3slW8tpn9nsDJ-sivbAWCHj13h-M96ZHXzF5M0_ps";
    axios
      .get(`https://api.unsplash.com/photos/?client_id=${ACCESS_KEY}`, {
        params: {
          color: keywords,
          per_page: 3,
        },
      })
      .then((res: any) => {
        setCurImgs(() => {
          return res.data.map((img: any) => {
            return img?.urls?.thumb;
          });
        });
      })
      .catch((error) => {
        console.log("===>", error);
      });
  };

  // useEffect(() => {
  //   handleGetIMG();
  // }, []);
  return (
    <>
      {imgs.map((ele) => {
        return (
          <div
            style={{
              flex: 1,
            }}
          >
            <img src={ele} style={{ width: "100%", height: "100%" }} />
          </div>
        );
      })}
    </>
  );
};

const Picture = () => {
  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        flexWrap: "wrap",
        gap: 4,
        overflow: "scroll",
      }}
    >
      {img_keywords.map((ele) => {
        return (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>{ele}</span>
              <span style={{ cursor: "pointer", color: "#555" }}>查看更多</span>
            </div>
            <div style={{ display: "flex", gap: 4, height: "auto" }}>
              <PictureLine keywords={ele} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Picture;
