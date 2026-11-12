const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('gifFloat',{
 get:()=>ipcRenderer.invoke('get'),save:v=>ipcRenderer.invoke('save',v),choose:()=>ipcRenderer.invoke('choose'),
 open:v=>ipcRenderer.send('open',v),close:id=>ipcRenderer.send('close',id),lock:(id,v)=>ipcRenderer.send('lock',id,v),closeAll:()=>ipcRenderer.send('close-all'),
 minimize:id=>ipcRenderer.send('minimize',id),restore:id=>ipcRenderer.send('restore',id)
});