
import hypernova, { serialize, load } from 'hypernova';
import { mount } from 'redom';

export const renderRedom = (name, Component) => hypernova({
  server() {
    const domino = require('domino');
    const domImpl = domino.createDOMImplementation()

    return async (props) => {
      let newProps = props;

      if (typeof Component.serverPrefetch === 'function') {
        newProps = await Component.serverPrefetch(props);
      }

      global.document = domImpl.createHTMLDocument();
      global.SVGElement = function SVGElement () {};

      mount(document.body, new Component(newProps));
      return serialize(name, document.body.innerHTML, newProps);
    };
  },

  client() {
    const payloads = load(name);
    if (payloads) {
      payloads.forEach((payload) => {
        const { node, data } = payload;

        const { firstChild } = node
        const obj = new Component(data)

        if (firstChild) {
          mount(node, obj, firstChild)
          node.removeChild(firstChild)
        }
        mount(node, obj);
      });
    }

    return Component;
  },
});
