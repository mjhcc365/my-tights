import { Button } from "antd";
import { Textbox } from "fabric";
import fetchJsonp from "fetch-jsonp";

import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { CanvasStoreContext } from "@/store/canvas";
const zonghe =
  "https://api.caiyunapp.com/v2.6/p2Tk6q3dOepTkxUq/116.3176,39.9760/weather?alert=true&dailysteps=1&hourlysteps=24";

import "./Image.less";

const WeatherTypes: any = {
  1: "台风",
  2: "暴雨",
  3: "暴雪",
  4: "寒潮",
  5: "大风",
  6: "沙尘暴",
  7: "高温",
  8: "干旱",
  9: "雷电",
  10: "冰雹",
  11: "霜冻",
  12: "大雾",
  13: "霾",
  14: "道路结冰",
  15: "森林火险",
  16: "雷雨大风",
  17: "春季沙尘天气趋势预警",
  18: "沙尘",
};

const WarningLevels: any = {
  0: "白色",
  1: "蓝色",
  2: "黄色",
  3: "橙色",
  4: "红色",
};

const WeatherPhenomena: any = {
  CLEAR_DAY: "晴（白天）",
  CLEAR_NIGHT: "晴（夜间）",
  PARTLY_CLOUDY_DAY: "多云（白天）",
  PARTLY_CLOUDY_NIGHT: "多云（夜间）",
  CLOUDY: "阴",
  LIGHT_HAZE: "轻度雾霾",
  MODERATE_HAZE: "中度雾霾",
  HEAVY_HAZE: "重度雾霾",
  LIGHT_RAIN: "小雨",
  MODERATE_RAIN: "中雨",
  HEAVY_RAIN: "大雨",
  STORM_RAIN: "暴雨",
  FOG: "雾",
  LIGHT_SNOW: "小雪",
  MODERATE_SNOW: "中雪",
  HEAVY_SNOW: "大雪",
  STORM_SNOW: "暴雪",
  DUST: "浮尘",
  SAND: "沙尘",
  WIND: "大风",
};

const getWarnMesByCode = (code: string) => {
  return `${WeatherTypes[+code.slice(0, 2)]}${WarningLevels[+code.slice(2)]}}`;
};

const getPhenomenaByCode = (code: string) => {
  return WeatherPhenomena[code];
};

const getTemperatureByObj = (obj: {
  avg: string;
  date: string;
  max: number;
  min: number;
}) => {
  return `${obj.min}°~${obj.max}°`;
};

const Weather = () => {
  const store = useContext(CanvasStoreContext);
  const handleAddText = (param: string, options: any) => {
    if (!store.canvas) return;
    const text = new Textbox(param, {
      fontSize: 16,
      fontFamily: store.defaultFont,
      hbsType: "textbox",
      fill: store.defaultColor,
      selectable: true,
      ...options,
    } as any);
    store.addObject(text);
  };

  const fetchWeather = () => {
    return new Promise((resolve, reject) => {
      fetchJsonp(zonghe)
        .then((res) => res.json())
        .then((data) => {
          resolve(data);
        })
        .catch(() => {
          reject();
        });
    });
  };

  const onDrawPhenomena = () => {
    fetchWeather().then((data: any) => {
      const weather = getPhenomenaByCode(data?.result?.realtime?.skycon);
      handleAddText(weather, {});
    });
  };

  const onDrawTemperature = () => {
    fetchWeather().then((data: any) => {
      const temp = getTemperatureByObj(data?.result?.daily?.temperature[0]);
      handleAddText(temp, {});
    });
  };

  const onDrawWarning = () => {
    fetchWeather().then((data: any) => {
      const content = data?.result?.alert?.content || [];
      content.forEach((ele: any) => {
        const massage = getWarnMesByCode(ele?.code || "");
        handleAddText(massage, {});
      });
    });
  };

  function showmap(position: any) {
    console.log("==>showmap", position);
    //.强调coords
    var cords = position.coords;
    var latitude = cords.latitude; //获取纬度
    var longitude = cords.longitude; //获取经度
    console.log("==>纬度,经度", latitude, longitude);
  }
  function error(error: any) {
    console.log("==>error", error);
    //.强调code
    var err = error.code;

    switch (err) {
      case 1:
        alert("用户拒绝了位置服务");
        break;
      case 2:
        alert("获取不到位置信息");
        break;
      case 3:
        alert("获取信息超时");
    }
  }

  const getCurPosition = () => {
    if (navigator.geolocation) {
      // console.log("==>showmap", navigator.geolocation);
      navigator.geolocation.getCurrentPosition(showmap, error);
    } else {
      alert("该浏览器不支持获取地理位置");
    }
  };

  return (
    <div className="time-section-class">
      {/* <div className="time-section-images">
        <Button onClick={getCurPosition}>获取当前经纬度</Button>
      </div> */}
      <div className="time-section-images">
        <Button onClick={onDrawPhenomena}>天气</Button>
        <Button onClick={onDrawTemperature}>温度</Button>
        <Button onClick={onDrawWarning}>预警</Button>
      </div>
    </div>
  );
};

export default Weather;
