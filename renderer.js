const $=s=>document.querySelector(s),rows=$('#rows'),status=$('#status');let items=[];
const defaults=()=>Array.from({length:10},(_,id)=>({id,name:`가리개 ${id+1}`,src:'',kind:'file',locked:false,open:false,minimized:false,bounds:null}));
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const save=async msg=>{await window.gifFloat.save(items);if(msg)status.textContent='설정을 저장했습니다.';};
function render(){rows.innerHTML=items.map(x=>`<tr data-id="${x.id}"><td>${x.id+1}</td><td class="name"><input class="nameInput" value="${esc(x.name)}"></td><td><div class="src" title="${esc(x.src)}">${esc(x.src?x.src.split(/[\\/]/).pop():'이미지 미설정')}</div></td><td><button class="open ${x.open?'active':''}">O</button></td><td><button class="lock ${x.locked?'active':''}">T</button></td><td><button class="min ${x.minimized?'minactive':''}">B</button></td><td><button class="image">I</button></td></tr>`).join('');
 rows.querySelectorAll('tr').forEach(tr=>{const id=+tr.dataset.id,x=items[id];
 tr.querySelector('.nameInput').onchange=e=>{x.name=e.target.value.trim()||`가리개 ${id+1}`;save(false);};
 tr.querySelector('.open').onclick=()=>{if(!x.src){status.textContent='먼저 I 버튼으로 이미지를 설정하세요.';return;}x.open=!x.open;if(x.open){x.minimized=false;window.gifFloat.open(x);}else window.gifFloat.close(id);render();save(false);};
 tr.querySelector('.lock').onclick=()=>{x.locked=!x.locked;window.gifFloat.lock(id,x.locked);render();save(false);status.textContent=x.locked?'위치를 고정했습니다.':'위치 고정을 해제했습니다.';};
 tr.querySelector('.min').onclick=()=>{x.minimized=!x.minimized;if(x.minimized)window.gifFloat.minimize(id);else window.gifFloat.restore(id);render();save(false);};
 tr.querySelector('.image').onclick=async()=>{const choice=prompt('1: 이미지 파일 선택\\n2: FugiTech Browser Source URL 입력','1');if(choice==='1'){const p=await window.gifFloat.choose();if(p){x.src=p;x.kind='file';x.open=false;}}else if(choice==='2'){const u=prompt('http:// 또는 https:// URL을 입력하세요',x.kind==='url'?x.src:'https://reactive.fugi.tech/');if(u){try{const v=new URL(u.trim());if(!['http:','https:'].includes(v.protocol))throw 0;x.src=v.href;x.kind='url';x.open=false;status.textContent='URL을 설정했습니다. iframe 정책에 따라 표시가 제한될 수 있습니다.';}catch{status.textContent='올바른 HTTP(S) 주소가 아닙니다.';return;}}}render();save(false);};
 });}
(async()=>{const s=await window.gifFloat.get();items=defaults();if(Array.isArray(s))s.forEach(v=>{if(Number.isInteger(v.id)&&items[v.id])items[v.id]={...items[v.id],...v,open:false,minimized:false};});render();})();
$('#save').onclick=()=>save(true);
$('#allOpen').onclick=()=>{let n=0;items.forEach(x=>{if(x.src){x.open=true;x.minimized=false;window.gifFloat.open(x);n++;}});render();save(false);status.textContent=n?`${n}개 가리개를 열었습니다.`:'설정된 이미지가 없습니다.';};
$('#allClose').onclick=()=>{window.gifFloat.closeAll();items.forEach(x=>{x.open=false;x.minimized=false;});render();save(false);status.textContent='모든 가리개를 닫았습니다.';};