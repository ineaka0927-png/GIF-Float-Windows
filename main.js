const {app,BrowserWindow,ipcMain,dialog}=require('electron');
const path=require('node:path'),fs=require('node:fs');
const {pathToFileURL}=require('node:url');
let manager; const wins=new Map(); let settings=[];
const file=()=>path.join(app.getPath('userData'),'settings.json');
function save(){try{fs.mkdirSync(path.dirname(file()),{recursive:true});fs.writeFileSync(file(),JSON.stringify(settings,null,2));}catch(e){console.error(e)}}
function display(item){return {...item,displaySrc:item.kind==='file'?pathToFileURL(item.src).href:item.src};}
function managerOpen(){if(manager&&!manager.isDestroyed()){manager.show();return;}manager=new BrowserWindow({width:980,height:680,minWidth:760,minHeight:540,backgroundColor:'#151821',webPreferences:{preload:path.join(__dirname,'preload.js'),contextIsolation:true,nodeIntegration:false,sandbox:true}});manager.loadFile('index.html');manager.on('closed',()=>manager=null);}
function create(item){
 if(!Number.isInteger(item.id)||item.id<0||item.id>9||!item.src)return;
 let w=wins.get(item.id);if(w&&!w.isDestroyed()){w.webContents.send('update',display(item));w.show();return;}
 const b=item.bounds||{x:100+item.id*25,y:100+item.id*25,width:320,height:240};
 w=new BrowserWindow({x:b.x,y:b.y,width:b.width,height:b.height,minWidth:80,minHeight:60,frame:false,transparent:true,backgroundColor:'#00000000',resizable:true,movable:false,alwaysOnTop:true,skipTaskbar:true,hasShadow:false,webPreferences:{preload:path.join(__dirname,'sticker-preload.js'),contextIsolation:true,nodeIntegration:false,sandbox:true,webSecurity:true}});
 wins.set(item.id,w);w.loadFile('sticker.html');
 w.webContents.once('did-finish-load',()=>{if(!w.isDestroyed()){w.webContents.send('update',display(item));w.webContents.send('lock',!!item.locked);}});
 const saveBounds=()=>{if(w.isDestroyed()||w.isMinimized())return;let s=settings.find(x=>x.id===item.id);if(s){s.bounds=w.getBounds();save();}};
 w.on('move',saveBounds);w.on('resize',saveBounds);w.on('closed',()=>wins.delete(item.id));
}
app.whenReady().then(()=>{try{settings=JSON.parse(fs.readFileSync(file(),'utf8'));if(!Array.isArray(settings))settings=[];}catch{settings=[];}managerOpen();});
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit();});
ipcMain.handle('get',()=>settings);
ipcMain.handle('save',(_e,v)=>{if(!Array.isArray(v))return false;settings=v.slice(0,10);save();return true;});
ipcMain.handle('choose',async()=>{const r=await dialog.showOpenDialog(manager,{properties:['openFile'],filters:[{name:'Images',extensions:['png','gif','jpg','jpeg','webp','bmp']}]});return r.canceled?null:r.filePaths[0];});
ipcMain.on('open',(_e,v)=>create(v));
ipcMain.on('close',(_e,id)=>{const w=wins.get(id);if(w&&!w.isDestroyed())w.close();});
ipcMain.on('lock',(_e,id,locked)=>{const w=wins.get(id);if(w&&!w.isDestroyed())w.webContents.send('lock',!!locked);});
ipcMain.on('close-all',()=>{for(const w of wins.values())if(!w.isDestroyed())w.close();wins.clear();});
ipcMain.on('move-by',(e,dx,dy)=>{const w=BrowserWindow.fromWebContents(e.sender);if(w&&!w.isDestroyed()){const [x,y]=w.getPosition();w.setPosition(x+dx,y+dy);}});
ipcMain.on('minimize',(_e,id)=>{const w=wins.get(id);if(w&&!w.isDestroyed()){w.setSkipTaskbar(false);w.minimize();}});
ipcMain.on('restore',(_e,id)=>{const w=wins.get(id);if(w&&!w.isDestroyed()){w.setSkipTaskbar(true);w.restore();w.show();w.setAlwaysOnTop(true);}});
