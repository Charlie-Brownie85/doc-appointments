export type AppointmentSlot = {
  start: string,
  end: string,
  taken?: boolean,
};

export type Doctor = {
  id: number,
  firstName: string,
  lastName: string,
  specialty?: string,
};

export type Patient = {
  name :string,
  secondName : string,
  email : string,
  phone : string,
}

export type AgendaDay = {
  date: Date,
  availableSlots: AppointmentSlot[],
};
