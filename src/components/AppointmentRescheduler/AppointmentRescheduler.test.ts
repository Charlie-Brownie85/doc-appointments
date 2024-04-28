import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';

import AppointmentRescheduler from './AppointmentRescheduler.vue';

import { DATE_FORMATS } from '@/config';

import type { AppointmentSlot } from '@/types';

const testAppointment: AppointmentSlot = {
  start: '2024-04-29T09:30:00',
  end: '2024-04-29T09:45:00',
};

const mocks = vi.hoisted(() => ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  format: vi.fn((date: string, dateFormat: string) => new Date(date)),
}));

vi.mock('date-fns', () => ({
  __esModule: true,
  format: mocks.format,
}));

const setup = (props: {
  appointmentSelected: AppointmentSlot, loading?: boolean
} = { appointmentSelected: testAppointment, loading: false }) => ({
  user: userEvent.setup(),
  ...render(AppointmentRescheduler, {
    global: {
      mocks: {
        $t: (msg: string) => msg,
      },
    },
    props,
  }),
});

describe('AppointmentRescheduler', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders proper text', () => {
    const { getByText } = setup();

    expect(getByText('Reschedule')).toBeInTheDocument();
    expect(getByText('Click the button to confirm')).toBeInTheDocument();
  });

  it('renders the appointment details within the button in the proper format', () => {
    const { getByText } = setup();

    expect(mocks.format).toHaveBeenCalledWith(testAppointment.start, DATE_FORMATS.APPOINTMENT_DATE);
    expect(mocks.format).toHaveBeenCalledWith(testAppointment.start, DATE_FORMATS.APPOINTMENT_TIME);
    expect(getByText('{date} at {time}')).toBeInTheDocument();
  });

  it('emits the booking request event when the button is clicked', async () => {
    const { user, emitted, getByRole } = setup();

    const button = getByRole('button');

    await user.click(button);

    expect(emitted()).toHaveProperty('bookingRequested');
  });

  it('disables the button when it is loading', async () => {
    const { user, emitted, getByRole } = setup({ appointmentSelected: testAppointment, loading: true });

    const button = getByRole('button');

    await user.click(button);

    expect(emitted()).not.toHaveProperty('bookingRequested');
  });
});
