import React from "react";

import useLocalStorage from "react-use-localstorage";
import { QRCode } from "react-qr-svg";
import "./App.css";

const defaultItemsText = `
🏠客厅 存包处
缝纫研室 拉链纽扣 缝纫机
电子研室 强电线缆 列印角料 
手工研室 胶刀尺笔 缝纫线材	打磨流程 台钳钻架	手持电钻 小缝纫机
列印研室 打印耗材	游标卡尺 列印废料	打印备件
厨房	米面干粮 储备水源	厨房纸巾 储备湿粮	烘培耗材 蛋打发机 微蒸烤箱	储备汤料
仓库	排插线板 储备厨纸	 硬纸板箱	单车配件 泡沫盒子 厨房备件 收纳工具
`.trim();

export const Item = ({ value }: { value: string }) => {
  return (
    <li className="item">
      <QRCode value={value || ""} className="qrcode" />
      <h2>{value}</h2>
    </li>
  );
};
export const Items = ({ items, fontSize = "10mm" }: { items: string[], fontSize: string }) => {
  return (
    <ul className="items" style={{ fontSize }}>
      {items.map((e, i) => (
        <Item value={e} key={e + i} />
      ))}
    </ul>
  );
};
export default function App() {
  const [itemsText, setItemsText] = useLocalStorage(
    "itemsText",
    defaultItemsText
  );
  const [fontSize, setFontSize] = useLocalStorage("font-size", "10mm");
  const items = itemsText?.trim()?.split(/\s+/) || [];
  const Controls = () => <div className="control">
    <div>
      <label>
        标签字体大小
        <input
          onChange={(e) => setFontSize(e.target.value)}
          value={fontSize} />
      </label>
    </div>
    <div>
      <label>
        标签内容
        <textarea
          onChange={(e) => setItemsText?.(e.target.value)}
          value={itemsText} />
      </label>
    </div>
  </div>;
  return (
    <div className="root">
      <Controls />
      <div className="print">
        <Items items={items} fontSize={fontSize} />
      </div>
    </div>
  );
}
