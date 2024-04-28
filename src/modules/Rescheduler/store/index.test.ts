import { setActivePinia, createPinia } from 'pinia';

import {
  isSameDay,
  differenceInDays,
  isAfter,
  format,
  addDays,
  subDays,
} from 'date-fns';

import {
  availableSlotsEndpoint,
  bookSlotEndpoint,
} from '../api';

import { useRescheduleStore } from './index';

import { DATE_FORMATS } from '@/config';

import { getApiRoute, groupAppointmentsByDate, getMondays } from '@/utils';

import { slotsResults, slotsFor2Weeks } from '@/__mocks__/slots-results';

const mockedApiRequest = vi.fn(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (...args: any[]) => Promise.resolve({ data: slotsResults }),
);

vi.mock('@/utils', async () => {
  const actual: Object = await vi.importActual('@/utils');
  return {
    ...actual,
    __esModule: true,
    apiRequest: (...args: any[]) => mockedApiRequest(...args),
  };
});

const initialAppointmentDetails = {
  appointmentBooked: {
    start: '2024-05-24T10:30:00',
    end: '2024-05-24T10:40:00',
  },
  doctor: {
    id: 1,
    firstName: 'Simeon',
    lastName: 'Molas',
  },
  patient: {
    name: 'Rick',
    secondName: 'Sanchez',
    email: 'ricksanchez@email.com',
    phone: '+123456789',
  },
};

describe('Reschedule store', () => {
  let store: ReturnType<typeof useRescheduleStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useRescheduleStore();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch correct appointment details', async () => {
    await store.getAppointmentDetails('1');

    expect(store.appointmentBooked).toEqual(initialAppointmentDetails.appointmentBooked);
    expect(store.doctor).toEqual(initialAppointmentDetails.doctor);
    expect(store.patient).toEqual(initialAppointmentDetails.patient);
  });

  it('should call the available slots endpoint with the correct parameters', async () => {
    const mondayDate = '2024-05-06';
    const route = getApiRoute(availableSlotsEndpoint, { mondayDate });

    await store.fetchAvailableSlots(mondayDate);

    expect(mockedApiRequest).toHaveBeenCalledWith(route);
  });

  it('"fetchAvailableSlots" should return available slots grouped by day', async () => {
    const response = await store.fetchAvailableSlots('2024-05-03');

    expect(response).toEqual(groupAppointmentsByDate(slotsResults));
  });

  it('"fetch7DaysAgenda" should return available slots grouped by day for 7 days starting on param date', async () => {
    mockedApiRequest.mockImplementationOnce(() => Promise.resolve({ data: slotsFor2Weeks }));
    const date = new Date('2024-04-22');
    const response = await store.fetch7DaysAgenda(date);

    const filteredResponse = groupAppointmentsByDate(slotsFor2Weeks).flat().filter((agendaDay) => {
      const daysDifference = differenceInDays(agendaDay.date, date);
      return isAfter(agendaDay.date, date) && daysDifference < 7 && !isSameDay(agendaDay.date, date);
    });

    expect(response).toEqual(filteredResponse);
  });

  it('"fetchAgendaForNext7Days" should return available slots grouped by day for next 7 days after initial date', async () => {
    const nextWeek = addDays(new Date(), 7);
    await store.fetchAgendaForNext7Days();

    const mondays = getMondays(nextWeek);
    const route = getApiRoute(availableSlotsEndpoint, { mondayDate: format(mondays[0], DATE_FORMATS.SLOTS_REQUEST) });

    expect(mockedApiRequest).toHaveBeenCalledWith(route);
  });

  it('"fetchAgendaForPrevious7Days" should return available slots grouped by day for next 7 days after initial date', async () => {
    const nextWeek = subDays(new Date(), 7);
    await store.fetchAgendaForPrevious7Days();

    const mondays = getMondays(nextWeek);
    const route = getApiRoute(availableSlotsEndpoint, { mondayDate: format(mondays[0], DATE_FORMATS.SLOTS_REQUEST) });

    expect(mockedApiRequest).toHaveBeenCalledWith(route);
  });

  it('"initStore" should fill initial appointment details', async () => {
    expect(store.doctor).toStrictEqual({});
    expect(store.patient).toStrictEqual({});
    expect(store.appointmentBooked).toStrictEqual({});

    await store.initStore('1');

    expect(store.appointmentBooked).toEqual(initialAppointmentDetails.appointmentBooked);
    expect(store.doctor).toEqual(initialAppointmentDetails.doctor);
    expect(store.patient).toEqual(initialAppointmentDetails.patient);
  });

  it('"initStore" should call "fetch7DaysAgenda" with the correct parameters', async () => {
    await store.initStore('1');

    const date = new Date();
    const mondays = getMondays(date);
    const route = getApiRoute(availableSlotsEndpoint, { mondayDate: format(mondays[0], DATE_FORMATS.SLOTS_REQUEST) });

    expect(mockedApiRequest).toHaveBeenCalledWith(route);
  });

  it('calls booking endpoint with correct parameters', async () => {
    const rescheduledSlot = {
      start: '2024-06-01T10:30:00',
      end: '2024-06-01T10:40:00',
    };

    await store.initStore('1');

    const payload = {
      Start: '2024-06-01 10:30:00',
      End: '2024-06-01 10:40:00',
      Comments: 'Rescheduled appointment',
      Patient: {
        Name: initialAppointmentDetails.patient.name,
        SecondName: initialAppointmentDetails.patient.secondName,
        Email: initialAppointmentDetails.patient.email,
        Phone: initialAppointmentDetails.patient.phone,
      },
    };

    await store.bookSlot(rescheduledSlot);

    expect(mockedApiRequest).toHaveBeenNthCalledWith(
      2,
      bookSlotEndpoint,
      { data: payload, requestMethod: 'post' },
    );
  });
});
