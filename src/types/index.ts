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

export type Patient = {
  name :string,
  secondName : string,
  email : string,
  phone : string,
}
