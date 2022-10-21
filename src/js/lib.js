export const createElement = (tag, options) => {
  const { className, text, events = {}, children = [], ...attrs } = options;

  const el = document.createElement(tag);

  className && el.setAttribute("class", className);
  text && (el.textContent = text);

  Object.keys(events).forEach((key) => {
    events[key] && el.addEventListener(key, events[key]);
  });

  Object.keys(attrs).forEach((key) => {
    attrs[key] && el.setAttribute(key, attrs[key]);
  });

  el.append(...children);

  return el;
};
