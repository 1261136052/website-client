
export class category {
    id: bigint 
    categoryName: string
}
export interface Response {
    id: bigint 
    file: file
  }


export class file {
    id: any
    path: any
}
export class Goods {
    id: bigint 
    userId: any
    userName: string
    categoryId: any
    title: ''
    status: ''
    content: string
    price: Float32Array
    cover: ''
    filesIds: any[]
    transactionAddress: ''
    transactionDate: Date
    publish: Date
    files: any[]
}

export class order{
    id: bigint 
    goodsId:bigint 
    buyerId:bigint 
    buyerPhone:string
    buyDate:Date
    goods:Goods
}


export class article{
    id: bigint 
    articleCategoryId:bigint
    authorId:bigint 
    title:string 
    author:string 
    content:string
    cover:string
    publishDate:Date
    weight:number
    likeCount:number
}

export class category2 {
    id: bigint 
    name: string
}

