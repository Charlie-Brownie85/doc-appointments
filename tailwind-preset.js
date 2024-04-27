const colors = {
  base: {
    100: '#fafafa',
    200: '#f8f8f8',
    300: '#edeff2',
    400: '#d9d9d9',
    500: '#b3b3b3',
    600: '#535353',
    700: '#3c3c3c4a',
    800: '#212121',
    900: '#191414',
  },
  doc: {
    teal: {
      100: '#e5faf8',
      300: '#00ccb1',
      500: '#00b39b',
    },
    blue: {
      100: '#eef4fd',
      200: '#e0f7f4',
      300: '#5bbad5',
      500: '#3d83df',
      600: '#1662c6',
      800: '#2c3e50',
      900: '#1b2734',
    },
  },
  state: {
    error: {
      300: '#FED1D6',
      500: '#c40303',
    },
    success: {
      300: '#CBFAD5',
      500: '#3EBB59',
    },
    warning: {
      300: '#FFF3D3',
      500: '#E6B535',
    },
    info: {
      300: '#D3F5FF',
      500: '#1E90FF',
      700: '#2d62b1',
      900: '#082E6B',
    },
  },
};

module.exports = {
  darkMode: 'class',
  theme: {
    screens: {
      sm: '540px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    fontFamily: {
      body: [
        'Inter',
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'Oxygen',
        'Ubuntu',
        'Cantarell',
        'Fira Sans',
        'Droid Sans',
        'Helvetica Neue',
        'sans-serif',
      ],
    },
    fontSize: {
      xxs: '0.625rem',
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
    },
    lineHeight: {
      1: '1rem',
      2: '1.2rem',
      3: '1.5rem',
      4: '1.75rem',
      5: '2rem',
      6: '2.5rem',
      7: '3.125rem',
      8: '3.5rem',
      9: '5.5rem',
    },
    colors: {
      ...colors,
      transparent: 'transparent',
      current: 'currentColor',
      black: '#000',
      white: '#FFF',
    },
    boxShadow: {
      none: 'none',
      s: '0px 0px 4px rgba(0, 0, 0, 0.12)',
      sm: '0px 1px 4px rgba(0, 0, 0, 0.2)',
      DEFAULT: '0px 1px 8px rgba(0, 0, 0, 0.1)',
      xl: '0px 0px 16px rgba(0, 0, 0, 0.15)',
    },
    extend: {
      ringOffsetWidth: {
        3: '3px',
      },
    },
  },
};
