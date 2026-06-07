import React from "react";

export interface CalendarProps {
  selectedDate?: Date;
}

export function Calendar({ selectedDate }: CalendarProps) {
  return <div>Calendar: {selectedDate?.toDateString()}</div>;
}
