import { setActivePinia, createPinia } from 'pinia';

import {
  isSameDay,
  differenceInDays,
  isAfter,
} from 'date-fns';

import {
  availableSlotsEndpoint,
  // bookSlotEndpoint,
} from '../api';

import { useRescheduleStore } from './index';

import { getApiRoute, groupAppointmentsByDate } from '@/utils';

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

    expect(store.appointmentBooked).toEqual({
      start: '2024-05-24T10:30:00',
      end: '2024-05-24T10:40:00',
    });

    expect(store.doctor).toEqual({
      id: 1,
      firstName: 'Simeon',
      lastName: 'Molas',
    });

    expect(store.patient).toEqual({
      name: 'John',
      secondName: 'Doe',
      email: 'johndoe@email.com',
      phone: '123456789',
    });
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

  it.skip('"initStore" calls "getAppointmentDetails" and "fetch7DaysAgenda" with the correct parameters', async () => {
    const getAppointmentDetailsSpy = vi.spyOn(store, 'getAppointmentDetails');
    await store.initStore('1');

    expect(getAppointmentDetailsSpy).toHaveBeenCalled();
    expect(getAppointmentDetailsSpy).toHaveBeenCalledWith('1');
    // expect(store.fetch7DaysAgenda).toHaveBeenCalledWith(new Date());
  });
});
