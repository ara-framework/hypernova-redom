
import hypernova, { serialize, load, fromScript } from 'hypernova';
import { mount } from 'redom';

const mountComponent = (Component, node, data) => {
  const { firstChild } = node;
  const obj = new Component(data);

  if (firstChild) {
    mount(node, obj, firstChild);
    return node.removeChild(firstChild);
  }
  return mount(node, obj);
};

export const renderClient = (name, Component, id) => {
  const key = name.replace(/\W/g, '');
  const node = global.document.querySelector(`div[data-hypernova-key="${String(key)}"][data-hypernova-id="${String(id)}"]`);

  if (node) {
    const data = fromScript({
      'hypernova-key': key,
      'hypernova-id': id,
    });

    mountComponent(Component, node, data);
  }
};

export const renderRedom = (name, Component) => hypernova({
  server() {
    return async (props) => {
      let newProps = props;

      if (typeof Component.serverPrefetch === 'function') {
        newProps = await Component.serverPrefetch(props);
      }
      const domino = require('domino'); // eslint-disable-line global-require
      const domImpl = domino.createDOMImplementation();
      global.document = domImpl.createHTMLDocument();
      global.SVGElement = function SVGElement() {};

      mount(global.document.body, new Component(newProps));
      return serialize(name, global.document.body.innerHTML, newProps);
    };
  },

  client() {
    const payloads = load(name);
    if (payloads) {
      payloads.forEach((payload) => {
        const { node, data } = payload;
        mountComponent(Component, node, data);
      });
    }

    return Component;
  },
});
