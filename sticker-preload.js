const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('stickerAPI',{
 onUpdate:cb=>ipcRenderer.on('update',(_e,v)=>cb(v)),onLock:cb=>ipcRenderer.on('lock',(_e,v)=>cb(v)),
 moveBy:(x,y)=>ipcRenderer.send('move-by',x,y)
});