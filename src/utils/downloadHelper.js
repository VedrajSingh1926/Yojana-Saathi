export function triggerLocalDownload(filename, content) {
  const element = document.createElement('a');
  const file = new Blob([content], {type: 'text/plain;charset=utf-8'});
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
  document.body.removeChild(element);
}
