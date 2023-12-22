class WebsocketManager {
    constructor(){
        this.connectedPeers = {}
    }
    addPeer(peer){
        this.connectedPeers[peer.id] = peer
    }
    removePeer(peer){
        delete this.connectedPeers[peer.id]
    }
    getPeer(peerId){
        return this.connectedPeers[peerId]
    }
    getAllPeers(){
        return this.connectedPeers
    }
    sentToAll(message,excludeSelf = false,self = null){
        Object.values(this.connectedPeers).forEach(peer => {
            if(excludeSelf && peer == self) return
            peer.socket.send(JSON.stringify(message))
        })
    }
    sendToServer(server,message){
        let serverSocket = this.connectedPeers[server]
        if (serverSocket) {
            serverSocket.socket.send(JSON.stringify(message))
        }
    }
}
module.exports = WebsocketManager