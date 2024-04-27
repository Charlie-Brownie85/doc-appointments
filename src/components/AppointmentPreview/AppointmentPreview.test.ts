import { defineComponent } from 'vue';

import { render } from '@testing-library/vue';

import AppointmentPreview from './AppointmentPreview.vue';

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
  appointmentBooked: AppointmentSlot, loading?: boolean
} = { appointmentBooked: testAppointment, loading: false }) => ({
  ...render(AppointmentPreview, {
    global: {
      stubs: {
        SVGIcon: defineComponent({
          name: 'SVGIcon',
          template: '<span>icon</span>',
        }),
      },
      mocks: {
        $t: (msg: string) => msg,
      },
    },
    props,
  }),
});

describe('AppointmentPreview', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the appointment details in the proper format', () => {
    const { getByText } = setup();

    const appointmentDate = new Date(testAppointment.start);
    expect(mocks.format).toHaveBeenCalledWith(appointmentDate, DATE_FORMATS.APPOINTMENT_DATE);
    expect(mocks.format).toHaveBeenCalledWith(appointmentDate, DATE_FORMATS.APPOINTMENT_TIME);
    expect(getByText('On {date} at {time}')).toBeInTheDocument();
  });

  it('renders the calendar icon if not loading', () => {
    const { getByText } = setup();

    expect(getByText('icon')).toHaveAttribute('name', 'calendar');
  });

  it('doesn\'t render stroke-through text when not loading', () => {
    const { queryByTestId } = setup();

    expect(queryByTestId('strokeThrough')).not.toBeInTheDocument();
  });

  it('renders the loader spinner when loading', () => {
    const { getByTestId } = setup({ appointmentBooked: testAppointment, loading: true });

    expect(getByTestId('loader')).toBeInTheDocument();
  });

  it('renders stroke-through text when loading', () => {
    const { getByTestId } = setup({ appointmentBooked: testAppointment, loading: true });

    expect(getByTestId('strokeThrough')).toBeInTheDocument();
  });
});
