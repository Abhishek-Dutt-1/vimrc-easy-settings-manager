// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const information = document.getElementById('info')
information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`


document.getElementById('check').addEventListener('click', window.versions.check, false);

const func = async () => {
  const response = await window.versions.ping()
  console.log(response) // prints out 'pong'
}

func()