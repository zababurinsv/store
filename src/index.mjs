import Task from './task/z_task.mjs'
import emoji from './emoji/emoji.mjs'

export default {
    send: (task = '', message = {}, callback = false, skip = true) => {
        return new Promise(async (resolve, reject) => {
            if(skip) {
                console.log(`${emoji('moon')[1][0]}`, task + ' start')
                await Task.promise(task, message,(event) => {
                    console.log(`    ${emoji('moon')[2][0]}`, task, 'finish');
                    /**
                     * Неопределённое поведение если в одном месте есть callback а в другом нет
                     */
                    (callback)
                        ? resolve(callback(event))
                        : resolve(event)
                })
            } else {
                console.log(`    ${emoji('moon')[0][2]}`,`${task} stop`)
                resolve({
                    status: true,
                    message: 'stop',
                    _scriptDir: import.meta.url
                })
            }
        })
    },

    await:(task = '', call = (event) => { console.log('default call', event) }) => {
        console.log(`${emoji('moon')[0][0]}`, task)
        return Task.await(task, call)
    },

    list:() => {
        return Task.list().then((item) => {
            console.log(`${emoji('moon')[0][1]}`, item)
        })
    },

    close:(task = '')=> {
        return Task.close(task).then((item)=>{
            console.log(`${emoji('moon')[0][3]}`, item)
        })
    }
}