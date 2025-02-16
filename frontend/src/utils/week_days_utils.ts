export const getWeekBoundariesMonday = (date: Date): { weekStart: Date; weekEnd: Date } => {
    // Adjust the day index so that Monday becomes 0 (if date.getDay() returns 0 for Sunday)
    const day = date.getDay();
    const diff = day === 0 ? -6 : 1 - day; // If it's Sunday, subtract 6 days; otherwise, subtract (day-1)
    
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() + diff);
    weekStart.setHours(0, 0, 0, 0);
  
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
  
    return { weekStart, weekEnd };
};

