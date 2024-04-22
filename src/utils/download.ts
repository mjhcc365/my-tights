export const download = (dataURL: any, filename: string) => {
  var downloadLink: any = document.createElement("a");
  downloadLink.href = dataURL;
  downloadLink.download = filename; // 设置下载的文件名
  // 将链接添加到文档中
  document.body.appendChild(downloadLink);
  // 模拟点击链接以触发下载
  downloadLink.click();
  // 移除链接元素
  document.body.removeChild(downloadLink);
};

export const downloadJson = (jsonString: string) => {
  // 创建一个Blob对象
  var blob = new Blob([jsonString], { type: "application/json" });

  // 创建一个<a>标签
  var downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = "group.json";

  // 模拟点击<a>标签以触发下载
  downloadLink.click();
};
