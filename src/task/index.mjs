import task from './task.mjs'
import emoji from '../emoji/emoji.mjs'
export default {
    set:(view,property,color,substrate,relation)=>{
        return new Promise(function (resolve, reject) {
            console.log(`${emoji('moon')[1][0]}`, relation + ' init')
            if(view) {
                task(view, property,color,substrate ,relation, (event)=>{
                    console.log(`    ${emoji('moon')[2][0]}`,relation)
                    resolve(event)
                })
            } else {
                console.log(`    ${emoji('moon')[0][2]}`,`${relation} stop`)
                resolve({
                    status:true,
                    message: 'stop',
                    _scriptDir: import.meta.url
                })
            }

        })
    },
    get:(view,property,color,substrate,relation, callback)=>{
        console.log(`${emoji('moon')[0][0]}`, relation)
        return task(view, 'await',color,{property, substrate} ,relation, callback)
    },
    list:(view,property,color,substrate,relation, callback) => {
        let list = task(view, 'list')
        list.then((item)=>{
            console.log(`${emoji('moon')[0][1]}`, item)
        })
        return list
    },
    close:(view,property,color,substrate,relation, callback)=> {
        let close = task(view,'close',color,substrate,relation)
        close.then((item)=>{
            console.log(`${emoji('moon')[0][3]}`, item)
        })
        return close
    }
}