import { FlatList } from "react-native";
import HistoryItem from "./HistoryItem";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import { parseISO } from "date-fns";

export default function HistoryList({
  startDate,
  endDate,
  maxLength = 50,
  style = {},
}) {
  const historyData = useSelector((s) => s.history.historyData) ?? [];
  const alamat = useSelector((s) => s.unitKerja.alamat) ?? "Alamat";

  // console.log(`historyData: ${JSON.stringify(historyData)}`);

  const filteredData = useMemo(() => {
    return historyData.filter((item) => {
      // parse your “master” date (e.g. "2025-05-20")
      const dt = parseISO(item.date);
      // console.log(`dt: ${dt}`);
      // console.log(`startDate: ${startDate}`);
      // console.log(`endDate: ${endDate}`);
      return dt >= startDate && dt <= endDate;
    });
  }, [historyData, startDate, endDate]);

  return (
    <FlatList
      style={style}
      data={filteredData}
      keyExtractor={(item) => item.date}
      renderItem={({ item, index }) => (
        <HistoryItem
          maxLength={maxLength}
          color={item.color}
          date={item.date}
          isDinas={item.isDinas}
          dinasDescription={item.dinasDescription}
          status={item.status}
          address={alamat}
          time={item.checkInTime ?? item.time}
          checkin_time={item.checkInTime}
          checkout_time={item.checkOutTime}
          hideTopLine={index === 0}
          hideBottomLine={index === filteredData.length - 1}
        />
      )}
    />
  );
}
