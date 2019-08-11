# hypernova-redom 

[RE:DOM](https://github.com/redom/redom) bindings for [Hypernova](https://github.com/airbnb/hypernova).

On the server, wraps the component in a function to render it to a HTML string given its props.

On the client, calling this function with your component scans the DOM for any server-side rendered instances of it. It then resumes those components using the server-specified props.

## Install

```sh
npm install hypernova-redom
```

## Usage

Here's how to use it in your module:

```js
import { renderRedom } from 'hypernova-redom'
import Example from './components/Example'

export default renderRedom('Example', Example)
```

### Server Prefetch

You need to add a method `serverPrefetch` to components that needs to fetch data in the server before be rendered.


```js
class Example {
  constructor({ items }) {
    this.el = // render view using items
  }
}

Example.serverPrefetch = async (props) => {
  const items = await // perform request outside the app

  // return new props (original props + fetched data)
  return {
    ...props,
    items
  }
}

```