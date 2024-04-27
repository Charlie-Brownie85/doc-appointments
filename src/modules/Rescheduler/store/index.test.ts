import { setActivePinia, createPinia } from 'pinia';

import {
  availableSlotsEndpoint,
  // bookSlotEndpoint,
} from '../api';

import { useRescheduleStore } from './index';

import { getApiRoute } from '@/utils';

import { slotsResults } from '@/__mocks__/slots-results';

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
      Start: '2024-05-24T10:30:00',
      End: '2024-05-24T10:40:00',
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

  it('should store the fetched available slots', async () => {
    await store.fetchAvailableSlots('2024-05-03');

    expect(store.availableSlots).toEqual(slotsResults);
  });
});
