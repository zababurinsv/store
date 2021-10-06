import loaderFS from './fs/main.mjs'
import wasm from './fs/wasmBinary.mjs'
import api from './fs/api.mjs'
let fs = {}

async function idbfs() {
    let idbfs = await loaderFS({ wasmBinary: wasm })
    fs = idbfs.FS
    fs.mkdir('./fs');
    fs.mount(idbfs.FS.filesystems.IDBFS, { test:"test" }, "./fs")
    fs.api = await api(fs)
    await fs.api.fsLoad();
    console.log(fs.api)
    return fs
}

async function worker() {
    let worker = new Worker(new URL('./worker.mjs', import.meta.url), { type: "module" })

    worker.onmessage = msg => {

        console.log("[Main thread] Got message back:", msg.data);
    }

    worker.onerror = function(event) {
        console.log('There is an error with your worker!', event);
    }

    worker.postMessage({test: "test"})
}

let init = {
    worker: worker,
    idbfs: idbfs
}

export default () => {
    return new Promise(async (resolve, reject) => {
        try {
            await init.idbfs()
            await init.worker()
            resolve({
                status: "true",
                success: true,
                message: ''
            })
        } catch (e) {
            resolve({
                status: "false",
                success: false,
                message: e
            })
        }
    })
}