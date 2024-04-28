import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';

import AppointmentTimeSlot from './AppointmentTimeSlot.vue';

import type { AppointmentSlot } from '@/types';

const testAppointment: AppointmentSlot = {
  start: '2024-04-29T09:30:00',
  end: '2024-04-29T09:45:00',
};

const setup = (props: {
  appointmentSlot: AppointmentSlot, isSelected?: boolean
} = { appointmentSlot: testAppointment, isSelected: false }) => ({
  user: userEvent.setup(),
  ...render(AppointmentTimeSlot, {
    props,
  }),
});

describe('AppointmentTimeSlot', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render time slot correctly', () => {
    const { getByText } = setup();

    expect(getByText('09:30')).toBeInTheDocument();
  });

  it('should render proper classes by default', () => {
    const { getByTestId } = setup();

    const slot = getByTestId('appointment-time-slot');

    expect(slot).toHaveClass('appointment-time-slot');
    expect(slot).not.toHaveClass('appointment-time-slot--taken');
    expect(slot).not.toHaveClass('appointment-time-slot--selected');
  });

  it('should emit select event when clicked', async () => {
    const { user, emitted, getByTestId } = setup();

    await user.click(getByTestId('appointment-time-slot'));

    expect(emitted()).toHaveProperty('slotSelected');
  });

  it('should render proper classes when slot is already taken', () => {
    const takenAppointment = {
      ...testAppointment,
      taken: true,
    };

    const { getByTestId } = setup({ appointmentSlot: takenAppointment });

    const slot = getByTestId('appointment-time-slot');

    expect(slot).toHaveClass('appointment-time-slot--taken');
  });

  it('should not emit an event when slot is already taken', async () => {
    const takenAppointment = {
      ...testAppointment,
      taken: true,
    };

    const { user, emitted, getByTestId } = setup({ appointmentSlot: takenAppointment });

    await user.click(getByTestId('appointment-time-slot'));

    expect(emitted()).not.toHaveProperty('slotSelected');
  });

  it('should render proper classes when slot is selected', () => {
    const { getByTestId } = setup({ appointmentSlot: testAppointment, isSelected: true });

    const slot = getByTestId('appointment-time-slot');

    expect(slot).toHaveClass('appointment-time-slot--selected');
    expect(slot).not.toHaveClass('appointment-time-slot--taken');
  });

  it('should not emit an event when slot is selected', async () => {
    const { user, emitted, getByTestId } = setup({ appointmentSlot: testAppointment, isSelected: true });

    await user.click(getByTestId('appointment-time-slot'));

    expect(emitted()).not.toHaveProperty('slotSelected');
  });
});
