import { Container } from "@/components/Container/Container";

export function FileLoader(
  { className = '', attrs = {} } = {},
  ...children
) {
  // simple content placeholder; you can pass children to override
  const content = children.length
    ? children
    : ['File Loader']

  // compose with your Container (border + 10px padding)
  const root = Container(
    { className: "", attrs },
    ...content
  )

  return {
    el: root,
    unmount() {
      // no side-effects yet; nothing to dispose
      // keep this for future file input listeners/observers
    }
  }
}