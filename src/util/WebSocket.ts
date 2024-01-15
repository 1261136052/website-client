// export class WebSocketClient {
//     private socket: WebSocket;
//     constructor(private uri: string) {
//         this.ws();
//     }
//     public ws = () => {
//         if (this.socket != null) {
//             this.socket.close();
//             // socket = null;
//         }
//         this.socket = new WebSocket(this.uri);
//         // this.socket.send("  ");
//         //打开事件
//         this.socket.onopen = function () {
//             console.log("websocket已打开");
//         };
//         //获得消息事件
//         this.socket.onmessage = function (msg) {
//             console.log(msg.data);
//         };

//         //关闭事件
//         this.socket.onclose = (event) => {
//             console.log("WebSocket connection closed:", event);
//             setTimeout(() => {
//                 this.ws();
//             }, 5000);
//         };
//         //发生了错误事件
//         this.socket.onerror = function () {
//             console.log("websocket发生了错误");
//         }
//     }
//     public sendMessage = (msg: any) => {
//         let contentText = msg
//         this.socket.send(contentText);
//     }

//     public close = () => {
//         this.socket.close();
//     }
// }

interface ExtendedWebSocket extends WebSocket {
    ws: WebSocket;
}
import { testStore } from "../stores/TestStore"
import { defineStore, storeToRefs } from "pinia";

export class WebSocketClient {
    private static url: string;
    private readonly protocols?: string | string[];
    public static websocket: WebSocket | null;

    constructor(url: string, protocols?: string | string[]) {
        WebSocketClient.url = url;
        this.protocols = protocols;
        WebSocketClient.websocket = null;
    }

    public open(): void {
        if (!WebSocketClient.websocket || WebSocketClient.websocket.readyState !== WebSocket.OPEN) {
            WebSocketClient.websocket = new WebSocket(WebSocketClient.url, this.protocols);

            // 处理打开事件
            WebSocketClient.websocket.onopen = () => {
                console.log('WebSocket opened: ' + WebSocketClient.url);
                // 开始心跳
                setInterval(() => {
                    if (WebSocketClient.websocket && WebSocketClient.websocket.readyState === WebSocket.OPEN) {
                        WebSocketClient.websocket.send('ping');
                    }
                }, 1000 * 30);
            };

            // 处理消息事件
            WebSocketClient.websocket.onmessage = (event) => {
                const store = testStore()
                let { messagess } = storeToRefs(store)
                // console.log(messagess)
                console.log('WebSocket message received: ' + event.data);
            };

            // 处理错误事件
            WebSocketClient.websocket.onerror = (event) => {
                console.error('WebSocket error: ' + event);
            };

            // 处理关闭事件
            WebSocketClient.websocket.onclose = () => {
                console.log('WebSocket closed: ' + WebSocketClient.url);
                // 断线重连
                setTimeout(() => {
                    this.open();
                }, 1000 * 5);
            };
        }
    }

    public static close(): void {
        if (WebSocketClient.websocket) {
            WebSocketClient.websocket.close();
            WebSocketClient.websocket = null;
        }
    }


    // public send(val:string): void {
    //     if (WebSocketClient.websocket && WebSocketClient.websocket.readyState === WebSocket.OPEN) {
    //         WebSocketClient.websocket.send(val);
    //     }
    // }
}

//   // 使用示例
//   const ws = new WebSocketClient('ws://localhost:8080');
//   ws.open();


export class ReqChat {
    readerId: bigint 
    listenerId: bigint 
    content: string
    publishDate: Date
    constructor(readerId: bigint , listenerId: bigint , content: string) {
        this.content = content
        this.listenerId = listenerId
        this.readerId = readerId
    }
}

export class user {
    token: string
    userName: string
    id: bigint 
}

export class users {
    data: user[] = []
}

export class messages {
    data: Map<bigint , message[]> = new Map()
}
export class message {
    id: bigint 
    readerId: bigint 
    listenerId: bigint 
    content: string
    publishDate: Date
}


export class message2 {
    id: bigint 
    articleId: bigint 
    userId: bigint 
    content: string
    userName: string
    sendDate: Date
}