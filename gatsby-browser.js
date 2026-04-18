const React = require('react');

const PageFade = ({ children, location }) => {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    setVisible(false);
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true));
    });
    return () => cancelAnimationFrame(raf);
  }, [location && location.key]);

  return React.createElement('div', {
    style: {
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.35s ease',
    },
  }, children);
};

exports.wrapPageElement = ({ element, props }) =>
  React.createElement(PageFade, { location: props.location }, element);
