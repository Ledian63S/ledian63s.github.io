module.exports = {
  siteTitle: 'Ledian Leka',
  siteDescription:
    'Ledian Leka is a Software Developer at BE-terna, who loves learning new things and helping tech beginners.',
  siteKeywords:
    'Ledian Leka, Ledian, Leka, Ledian63S, software developer, software engineer',
  siteUrl: 'https://ledian63s.github.io/',
  siteLanguage: 'en_US',
  googleAnalyticsID: 'UA-45666519-2',
  googleVerification: 'DCl7VAf9tcz6eD9gb67NfkNnJ1PKRNcg8qQiwpbx9Lk',
  name: 'Ledian Leka',
  location: 'Tirana, Albania',
  email: 'leka.ledian@live.co.uk',
  github: 'https://github.com/Ledian63S',
  twitterHandle: '@Ledian63S',
  socialMedia: [
    {
      name: 'GitHub',
      url: 'https://github.com/Ledian63S',
    },
    {
      name: 'Linkedin',
      url: 'https://www.linkedin.com/in/lekaledian/',
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/leka.ledian',
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/Ledian63S',
    },
  ],

  navLinks: [
    {
      name: 'About',
      url: '/#about',
    },
    {
      name: 'Experience',
      url: '/#jobs',
    },
    {
      name: 'Work',
      url: '/#projects',
    },
    {
      name: 'Contact',
      url: '/#contact',
    },
  ],

  navHeight: 100,

  colors: {
    green: '#64ffda',
    navy: '#0a192f',
    darkNavy: '#020c1b',
  },

  srConfig: (delay = 200) => ({
    origin: 'bottom',
    distance: '20px',
    duration: 500,
    delay,
    rotate: { x: 0, y: 0, z: 0 },
    opacity: 0,
    scale: 1,
    easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    mobile: true,
    reset: false,
    useDelay: 'always',
    viewFactor: 0.25,
    viewOffset: { top: 0, right: 0, bottom: 0, left: 0 },
  }),
};
