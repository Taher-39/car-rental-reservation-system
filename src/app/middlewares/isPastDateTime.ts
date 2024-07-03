export const isPastDateTime = (date: string, time: string): boolean => {
    const bookingDateTime = new Date(`${date}T${time}:00`);
    return bookingDateTime < new Date();
};