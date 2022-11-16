module.exports = {
  palette: {
    common: {
      black: '#000',
      white: '#fff'
    },
    primary: {
      light: '#2F3C4C',
      main: '#0D191F',
      dark: '#2B4066'
    },
    secondary: {
      light: '#242B2F',
      main: '#121720',
      dark: '#050818'
    },
    error: {
      light: '#DE6967',
      main: '#D64441',
      dark: '#952f2d'
    },
    grey: {
      50: '#9CA9AC',
      100: '#6A7375',
      200: '#5C6569',
      300: '#636E75',
      400: '#4D585F',
      500: '#3D4850',
      600: '#212C35',
      700: '#1B2533',
      800: '#121929',
      900: '#050818'
    },
    colors: {
      red: '#D64441',
      yellow: '#FAB849',
      lavander: '#BB6BD9',
      green: '#27AE60',
      blue: '#3FA7D6',
      lightBlue: '#192A47',
      liberty: '#6761a8',
      jungleGreen: '#43aa8b',
      maximumRed: '#d62828',
      darkYellow: '#f18805',
      orange: '#f26430'
    },
    text: {
      disabled: 'rgba(255, 255, 255, 0.38)',
      hint: 'rgba(255, 255, 255, 0.38)',
      primary: '#E1E2E4',
      secondary: '#D2D4D6',
      third: '#979CA1',
      icon: '#F0F0F1'
    },
    type: 'dark'
  },
  action: {
    hover: 'rgba(255, 255, 255, 0.1)',
    selected: 'rgba(255, 255, 255, 0.2)'
  },
  duration: {
    longer: 0.3,
    main: 0.2,
    shorter: 0.1
  },
  shape: { borderRadius: '4px' },
  spacing: factor => [0, 4, 8, 16, 32, 64][factor],
  sizes: {
    width: {
      sidebar: 175
    },
    height: {
      systemNavbar: 45
    }
  }
};
