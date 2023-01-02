export default function isInputEvent(event: KeyboardEvent): boolean {
  const target = event.target as Node;
  return target.nodeType === Node.ELEMENT_NODE && (target.nodeName === "INPUT" || target.nodeName === "SELECT");
}
