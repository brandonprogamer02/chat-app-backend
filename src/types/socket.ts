interface IBaseSocketEmit {
     socketId: string
}

export interface INewMessageSocketEmit extends IBaseSocketEmit{
     chatId: string
}

export interface INewConnectionSocketEmit extends IBaseSocketEmit{
     userId: string
}

export interface IDeleteChatSocketEmit extends IBaseSocketEmit{
     chatId: string
}