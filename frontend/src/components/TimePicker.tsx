import React, { useEffect, useState } from "react";
import { Button } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";

interface TimePickerProps {
  label: string;
  value?: Date,
  onTimeSelected: (time: Date) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ label, value, onTimeSelected }) => {
  const [showPicker, setShowPicker] = useState(true);
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());

  useEffect(() => {
    if (value)
      setSelectedTime(value)
  }, [value])

  const onChange = (event: any, date?: Date) => {
    if (date) {
      setSelectedTime(date);
      onTimeSelected(date);
    }
  };

  return (
    <>
      {showPicker && (
        <DateTimePicker
          value={selectedTime || new Date()}
          mode="time"
          display={Platform.OS === "ios" ? "inline" : "default"}
          {...(Platform.OS === "ios" ? { is24Hour: true } : {})}
          onChange={onChange}
        /> as any
      )}
    </>
  );
};

export default TimePicker;
