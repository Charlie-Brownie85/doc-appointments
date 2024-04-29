/* eslint-disable vue/one-component-per-file */
import { defineComponent } from 'vue';

import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';

import AppointmentsCalendar from './AppointmentsCalendar.vue';

import type { AgendaDay } from '@/types';

import { testAvailableSlots } from '@/__mocks__/slots-results';

const testStartingDate = testAvailableSlots[0].date;

const defaultProps = {
  startingDate: testStartingDate,
  availableSlots: testAvailableSlots,
  isFetchingSlots: false,
  isFetchError: false,
};

const setup = (props: {
  startingDate: Date,
  availableSlots: AgendaDay[],
  isFetchingSlots?: boolean,
  isFetchError?: boolean,
} = defaultProps) => ({
  user: userEvent.setup(),
  ...render(AppointmentsCalendar, {
    global: {
      stubs: {
        SVGIcon: defineComponent({
          name: 'SVGIcon',
          template: '<span>icon</span>',
        }),
        AppointmentTimeSlot: defineComponent({
          name: 'AppointmentTimeSlot',
          emits: ['slotSelected'],
          props: {
            appointmentSlot: {
              type: Object,
              required: true,
            },
            isSelected: {
              type: Boolean,
              default: false,
            },
          },
          template: `
            <div @click="$emit('slotSelected', $props.appointmentSlot)" data-testid="appointment-time-slot">{{ $props.appointmentSlot.start }}</div>
          `,
        }),
      },
      mocks: {
        $t: (msg: string) => msg,
      },
    },
    props,
  }),
});

describe('AppointmentsCalendar', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render calendar header with proper week days correctly', () => {
    const { getByText } = setup();

    expect(getByText('Mon')).toBeInTheDocument();
    expect(getByText('Tue')).toBeInTheDocument();
    expect(getByText('Wed')).toBeInTheDocument();
    expect(getByText('Thu')).toBeInTheDocument();
    expect(getByText('Fri')).toBeInTheDocument();
    expect(getByText('Sat')).toBeInTheDocument();
    expect(getByText('Sun')).toBeInTheDocument();
  });

  it('should render calendar header with proper month dates correctly', () => {
    const { getByText } = setup();

    expect(getByText('27 May')).toBeInTheDocument();
    expect(getByText('28 May')).toBeInTheDocument();
    expect(getByText('29 May')).toBeInTheDocument();
    expect(getByText('30 May')).toBeInTheDocument();
    expect(getByText('31 May')).toBeInTheDocument();
    expect(getByText('01 Jun')).toBeInTheDocument();
    expect(getByText('02 Jun')).toBeInTheDocument();
  });

  it('should render calendar header with "Today" and "Tomorrow" if starting date is today', () => {
    const newProps = {
      ...defaultProps,
      startingDate: new Date(),
    };

    const { getByText } = setup(newProps);

    expect(getByText('Today')).toBeInTheDocument();
    expect(getByText('Tomorrow')).toBeInTheDocument();
  });

  it('should not render loader spinner by default', () => {
    const { queryByTestId } = setup();

    expect(queryByTestId('loader')).not.toBeInTheDocument();
  });

  it('should render loader spinner if it\'s fetching slots', () => {
    const newProps = {
      ...defaultProps,
      isFetchingSlots: true,
    };
    const { queryByTestId } = setup(newProps);

    expect(queryByTestId('loader')).toBeInTheDocument();
  });

  it('should not render error message by default', () => {
    const { queryByText } = setup();

    expect(queryByText('An error occurred while fetching the available slots')).not.toBeInTheDocument();
  });

  it('should render error message if there is an error while fetching slots', () => {
    const newProps = {
      ...defaultProps,
      isFetchError: true,
    };
    const { queryByText } = setup(newProps);

    expect(queryByText('An error occurred while fetching the available slots')).toBeInTheDocument();
  });

  it('renders "See more hours" by default been folded', () => {
    const { getByText } = setup();

    expect(getByText('See more hours')).toBeInTheDocument();
  });

  it('renders "Less" once clicked and unfolded', async () => {
    const { user, getByText } = setup();

    await user.click(getByText('See more hours'));

    expect(getByText('Less')).toBeInTheDocument();
  });

  it('should emit "previousWeekRequested" event when clicking on previous week button', async () => {
    const { getByTestId, emitted } = setup();

    await userEvent.click(getByTestId('previousWeekButton'));

    expect(emitted()).toHaveProperty('previousWeekRequested');
  });

  it('should emit "nextWeekRequested" event when clicking on next week button', async () => {
    const { getByTestId, emitted } = setup();

    await userEvent.click(getByTestId('nextWeekButton'));

    expect(emitted()).toHaveProperty('nextWeekRequested');
  });

  it('should emit "slotSelected" event when clicking on an available slot', async () => {
    const { getAllByTestId, emitted } = setup();

    await userEvent.click(getAllByTestId('appointment-time-slot')[0]);

    expect(emitted()).toHaveProperty('slotSelected');
  });
});
