import React, { useState } from "react";
import { Button } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";

interface TimePickerProps {
  label: string;
  onTimeSelected: (time: Date) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ label, onTimeSelected }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());

  const onChange = (event: any, date?: Date) => {
    if (date) {
      setSelectedTime(date);
      onTimeSelected(date);
    }
    setShowPicker(false);
  };

  return (
    <>
      <Button onPress={() => setShowPicker(true)}>{label}</Button>
      {showPicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          is24Hour
          onChange={onChange}
        />
      )}
    </>
  );
};

export default TimePicker;
