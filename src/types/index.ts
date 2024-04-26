export type AppointmentSlot = {
  Start: string,
  End: string,
  Taken?: boolean,
};

export type Doctor = {
  id: number,
  firstName: string,
  lastName: string,
  specialty?: string,
};
