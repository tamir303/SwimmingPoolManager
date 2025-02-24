import React, { useEffect, useState } from "react";
import { Platform, View, Text, Button as RNButton } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

interface TimePickerProps {
  label?: string;
  value: Date;
  onTimeSelected: (time: Date) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ label, value, onTimeSelected }) => {
  const [showPicker, setShowPicker] = useState(Platform.OS === "ios");
  const [selectedTime, setSelectedTime] = useState<Date>(value || new Date());

  useEffect(() => {
    if (value instanceof Date && !isNaN(value.getTime())) {
      setSelectedTime(value); // Only update if value is a valid Date
    }
  }, [value]);

  const handleTimeChange = (date: Date) => {
    setSelectedTime(date);
    onTimeSelected(date);
  };

  // onChange for mobile platforms
  const onChange = (event: any, date?: Date) => {
    if (date) {
      handleTimeChange(date);
    }
    if (Platform.OS !== "ios") {
      setShowPicker(false);
    }
  };

  // For web, we convert the selectedTime to a time string in "HH:MM" format
  const formatTime = (date: Date): string => {
    const fdate = new Date(date);
    // Format date to HH:MM (24-hour format)
    const hours = fdate.getHours().toString().padStart(2, "0");
    const minutes = fdate.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleWebTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeParts = e.target.value.split(":");
    const date = new Date(selectedTime);
    date.setHours(parseInt(timeParts[0], 10));
    date.setMinutes(parseInt(timeParts[1], 10));
    handleTimeChange(date);
  };

  return (
    <View style={{ padding: 10 }}>
      {label && <Text style={{ marginBottom: 5 }}>{label}</Text>}
      {Platform.OS === "web" ? (
        // Use a native HTML time input for web
        <input
          type="time"
          value={formatTime(selectedTime)}
          onChange={handleWebTimeChange}
          style={{ padding: 10, fontSize: 16 }}
        />
      ) : (
        <>
          {/* For non-iOS (Android, Windows), show a button to toggle the picker */}
          {Platform.OS !== "ios" && (
            <RNButton
              title={selectedTime.toLocaleTimeString()}
              onPress={() => setShowPicker(true)}
            />
          )}
          {showPicker && (
            <DateTimePicker
              value={selectedTime}
              mode="time"
              display={Platform.OS === "ios" ? "inline" : "default"}
              is24Hour={true}
              onChange={onChange}
            />
          )}
        </>
      )}
    </View>
  );
};

export default TimePicker;
