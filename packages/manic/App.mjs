import yaml from "yaml";
console.log("app");
import fs from "fs/promises";
import _ from "lodash";
import { stringifyInterval } from "interval-conversions";
console.log("loaded");
const sectLength = 3600e3 / 4;
const stampHourRange = (stamp) => [
  Math.floor(+stamp / 3600e3),
  Math.ceil(+stamp / 3600e3),
];
const stampRangeHourRange = ([startStamp, endStamp]) => [
  Math.floor(+startStamp / 3600e3),
  Math.ceil(+endStamp / 3600e3),
];
const hourRangeDateRange = ([a, b]) => [a, b].map((e) => e * 3600e3);

const stampSectRange = (stamp) => [
  Math.floor(+stamp / sectLength),
  Math.ceil(+stamp / sectLength),
];
const stampRangeSectRange = ([startStamp, endStamp]) => [
  Math.floor(+startStamp / sectLength),
  Math.ceil(+endStamp / sectLength),
];
const SectRangeDateRange = ([a, b]) => [a, b].map((e) => e * sectLength);
const inRange = (t, [a, b]) => a <= t && t <= b;
const tagPatterns = {
  yoland: /yoland|snomiao-initial|monkai/im,
  姨学学习: /刘仲敬|劉仲敬|陈易宏|諸夏|姨學|姨学|瓦房店|洪水|洼地|小共同体/im,
  王剑直播: /王剑/im,
  //   视频: /Youtube|bilibili/im,
};
export async function App(dat) {
  const appsAll = dat.map((e) => {
    const StartStamp = new Date(e.Start);
    const EndStamp = new Date(e.End);
    const DurationMS = -+StartStamp + +EndStamp;
    const DurationHour = DurationMS;
    const StampRange = [StartStamp, EndStamp];
    const centerStamp = new Date((+StartStamp + +EndStamp) / 2);
    const pureName = e.Name.replace(/^Telegram \(\d+\)$/, "Telegram");
    //   const HourRange = stampRangeHourRange(StampRange);
    //   const SectRange = stampRangeSectRange(StampRange);
    const Name =
      pureName.indexOf(e.Process) - 1 ? pureName : pureName + " - " + e.Process;
    const tags = _.mapValues(
      tagPatterns,
      (tagPattern) => !!Name.match(tagPattern)
    );
    return {
      ...e,
      Name,
      StartStamp,
      EndStamp,
      DurationMS,
      DurationHour,
      StampRange,
      centerStamp,
      tags,
      // SectRange,
    };
  });
  const appsYml = (apps) => {
    const app2Sect = (e) => Math.floor(e.centerStamp / sectLength);
    const appsSects = _.groupBy(apps, app2Sect);
    const duraSum = (apps) => _.sumBy(apps, (app) => app.DurationMS);
    const jTop5 = (j) =>
      _.fromPairs(
        _.sortBy(_.entries(j), "1")
          .filter((e) => e[1] >= 60e3)
          .reverse()
          ?.slice?.(0, 5)
      );

    const sectAppsSums = (sectApps) =>
      _.mapValues(
        jTop5(_.mapValues(_.groupBy(sectApps, "Name"), duraSum)),
        (ms) => ({
          des: stringifyInterval(ms),
          len: "#".repeat(Math.floor(ms / 60e3)),
        })
      );
    const SectStringParse = (hhs) =>
      new Date(Number(hhs) * sectLength).toLocaleString() +
      " - " +
      new Date((Number(hhs) + 1) * sectLength).toLocaleString();
    const Sects = _.fromPairs(
      _.entries(appsSects).map(([k, v]) => [
        SectStringParse(k),
        sectAppsSums(v),
      ])
    );
    const hhyml = yaml.stringify(Sects);
    return hhyml;
  };

  const apps = appsAll.filter((e) => +e.StartStamp > +new Date("2022-01-01"));
  for await (const tag of _.keys(tagPatterns)) {
    const tagApps = apps.filter((e) => e.tags[tag]);
    const tagYml = appsYml(tagApps);
    await fs.writeFile("./data/tag_" + tag + ".yml", tagYml);
    //   fs.writeFile(hhyml)
  }
  //   console.log(hhyml);
  //   return hhyml;
}

export default App;
