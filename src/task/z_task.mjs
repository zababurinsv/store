import isEmpty from '../isEmpty/isEmpty.mjs'
import emoji from '../emoji/emoji.mjs'
let source = {}
let target = {}
let remove = {}
remove.staticProperty = {}
source.staticProperty = {}
target.staticProperty = {}
remove.staticProperty = {}
target.staticProperty = new Proxy({}, {
    get: (obj, prop) => {
        return obj[prop];
    },
    set: (obj, prop, value) => {
        if(isEmpty(obj[prop])){
            obj[prop] = []
        }
        obj[prop].push(value);
        return true
    }
});

source.staticProperty  = new Proxy({}, {
    get: (obj, prop) => {
        return obj[prop];
    },
    set: (obj, prop, value) => {
        if(isEmpty(obj[prop])){
            obj[prop] = []
        }
        obj[prop].push(value);
        return true
    }
});

let list = () => {
    return new Promise((resolve, reject) => {
        try {
            resolve({
                status: 'ok',
                success: true,
                message: {
                    target:target.staticProperty,
                    source:source.staticProperty,
                    remove:remove.staticProperty
                }
            })
        } catch (e) {
            resolve({
                status: 'false',
                success: false,
                message: e
            })
        }
    })
}

let close = (task) => {
    return new Promise(async (resolve, reject) => {
        try {
            isEmpty(source.staticProperty[`${task}`])
                ? delete target.staticProperty[`${task}`]
                : remove.staticProperty[`${task}`] = true
            resolve({
                status: 'ok',
                success: true,
                message: ''
            })
        } catch (e) {
            resolve({
                status: 'not ok',
                success: false,
                message: e
            })
        }
    })
}

let wait = (task, call) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!isEmpty(target.staticProperty[`${task}`])) {
                target.staticProperty[`${task}`] = { call: call }
                resolve(true)
            } else {
                if(isEmpty(source.staticProperty[`${task}`])) {
                    target.staticProperty[`${task}`] = { call: call }
                    resolve(true)
                } else {
                    console.log(`  ${emoji('moon')[2][1]}`, source.staticProperty[`${task}`][0]['task'])
                    target.staticProperty[`${task}`] = { call: call }
                    let item = target.staticProperty[`${task}`]
                    while(!isEmpty(source.staticProperty[`${task}`][0])) {
                        for(let i = 0; i < item.length; i++){
                            await item[i].call({
                                message: source.staticProperty[`${task}`][0]['message'],
                                task: source.staticProperty[`${task}`][0]['task'],
                                call: source.staticProperty[`${task}`][0]['call']
                            })
                        }
                        source.staticProperty[`${task}`].shift()
                    }
                    if(remove.staticProperty[`${task}`]) {
                        delete target.staticProperty[`${task}`]
                        delete remove.staticProperty[`${task}`]
                    }
                    delete source.staticProperty[`${task}`]
                    resolve(true)
                }
            }
        } catch (e) {
            console.log('error', e)
            resolve(false)
        }
    })
}


let promise = (task, message, call) => {
    return new Promise((resolve, reject) => {
        try {
            if(isEmpty(target.staticProperty[`${task}`])) {
                console.log(`  ${emoji('moon')[2][3]}`, task + ' process')
                source.staticProperty[`${task}`] = {
                    message: message,
                    task: task,
                    call: call
                }
                resolve(true)
            } else {
                console.log(`  ${emoji('moon')[1][3]}`, task + ' process')
                source.staticProperty[`${task}`] = {
                    message: message,
                    task:task,
                    call: call
                }
                while(!isEmpty(source.staticProperty[`${task}`][0])) {
                    target.staticProperty[`${task}`].forEach(item => {
                        item.call({
                            message: source.staticProperty[`${task}`][0]['message'],
                            task: source.staticProperty[`${task}`][0]['task'],
                            call: source.staticProperty[`${task}`][0]['call']
                        })
                    });
                    source.staticProperty[`${task}`].shift()
                }
                if(remove.staticProperty[`${task}`]) {
                    delete target.staticProperty[`${task}`]
                    delete remove.staticProperty[`${task}`]
                }
                delete source.staticProperty[`${task}`]
                resolve(true)
            }
        } catch (e) {
            resolve({
                status: 'false',
                success: false,
                message: e
            })
        }
    })
}

export default  {
    list: list,
    close: close,
    await: wait,
    promise: promise
}