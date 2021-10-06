import FS from './fs/main.mjs'
import wasm from './fs/wasmBinary.mjs'
import api from './fs/api.mjs'
let container = null ;
let files = null;
let workerFS = FS({ wasmBinary: wasm })
workerFS.then(async (Module)=> {
  let FS = Module.FS
  FS.mkdir('/data');
  FS.api = await api(FS)
  FS.mount(Module.FS.filesystems.WORKERFS, {
    files: files,
    blobs: []
  }, '/data');

  console.log('wfs', FS)
  // let fileContents = FS.readFile("/data/container", { encoding: "utf8" });
  // console.log("File contents:");
  // console.log(fileContents);
})

self.onmessage = (events) => {
  console.log(events)
  // files = msg.data;
  // files.name = "test.wav";
  // console.log(files);
  self.postMessage("Got it");
}