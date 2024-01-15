import { defineStore, storeToRefs } from "pinia";
import { WebSocketClient, user, messages, users } from '../util/WebSocket'
import axios from 'axios'
export const testStore = defineStore('test', {
    state: () => {
        return {
            UserData: { token: '', userName: '', id: -1n },
            // message: "sss",
            ws: WebSocketClient,
            path: 'http://127.0.0.1:8001/',
            links: new users(),
            messagess: new messages(),
            newMessage: false
        }
    },
    actions: {
        testA(val) {
            this.UserData = val
        },
        setWS(ws) {
            this.ws = ws
        },
        setLink(id, name) {
            let flag = false
            for (let l = 0;l<this.links.data.length;l++) {
                // console.log(this.links.data[l].id)
                if (this.links.data[l].id == id) {
                    flag = true
                    continue
                }
            }
            if (!flag) {
                console.log("addlinks")
                let add = new user()
                add.id = id
                add.userName = name
                this.links.data.push(add)
                console.log(add)
            } else {
                this.messagess.data.delete(id)
                console.log(null)
            }
        },

        setMessage(data) {
            let flag = false
            for (let l = 0;l<this.links.data.length;l++) {
                // console.log(this.links.data[l].id)
                if (this.links.data[l].id == data.readerId) {
                    flag = true
                    continue
                }
            }
            if (!flag) {
                console.log("addlinks")
                let add = new user()
                add.id = data.readerId
                axios.get('/user/getUserName/' + add.id, {
                }).then(response => {
                    if (response.data.code == 200) {
                        add.userName = response.data.data
                        this.links.data.push(add)
                        console.log(add)
                    }
                })
            }
            let message = this.messagess.data.get(data.readerId)
            console.log(message)
            console.log(data)
            console.log(this.messagess)
            if (message != null) {
                console.log("addmessagess")
                message.push(data)
                console.log(this.messagess)
                console.log("messagess")
            }


        },

    },
    getters: {
        testU(state) {
            return state.UserData
        },

        getWS() {
            return this.ws
        },
        getPath() {
            return this.path
        },
        getLinks() {
            return this.links
        },

    }
})