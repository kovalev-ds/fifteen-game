export const createElement = (tag, options) => {
  const {
    className,
    text,
    html,
    events = {},
    children = [],
    ...attrs
  } = options;

  const el = document.createElement(tag);

  className && el.setAttribute("class", className);
  text && (el.textContent = text);
  html && (el.innerHTML = html);

  Object.keys(events).forEach((key) => {
    events[key] && el.addEventListener(key, events[key]);
  });

  Object.keys(attrs).forEach((key) => {
    attrs[key] && el.setAttribute(key, attrs[key]);
  });

  el.append(...children);

  return el;
};

export const secToStringTime = (duration) =>
  `${String((duration / 60) | 0).padStart(2, "0")}:${String(
    duration % 60
  ).padStart(2, "0")}`;
