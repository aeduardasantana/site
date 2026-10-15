(function(){
"use strict";
const W=1122,H=1402;
const green="#092f1c",sage="#65865d",gold="#e9a72e";
function round(c,x,y,w,h,r,fill,stroke,lw=1){c.beginPath();c.roundRect(x,y,w,h,r);if(fill){c.fillStyle=fill;c.fill()}if(stroke){c.strokeStyle=stroke;c.lineWidth=lw;c.stroke()}}
function line(c,x,y,txt,size=26,color=green,weight=700,align="center"){c.textAlign=align;c.textBaseline="middle";c.font=weight+" "+size+"px system-ui, Arial";c.fillStyle=color;c.fillText(txt,x,y)}
function fit(c,text,max,size=29,weight=750){while(size>15){c.font=weight+" "+size+"px system-ui, Arial";if(c.measureText(text).width<=max)break;size--}return size}
function wrap(c,text,maxWidth,maxLines,size,weight){c.font=weight+" "+size+"px system-ui, Arial";let words=String(text||"").replace(/\s+/g," ").trim().split(" "),rows=[],row="";for(const word of words){let proposed=row?row+" "+word:word;if(c.measureText(proposed).width>maxWidth&&row){rows.push(row);row=word}else row=proposed}if(row)rows.push(row);if(rows.length>maxLines){rows=rows.slice(0,maxLines);let last=rows[maxLines-1];while(last.length&&c.measureText(last+"…").width>maxWidth)last=last.slice(0,-1);rows[maxLines-1]=last+"…"}return rows}
function heart(c,x,y,s,color,outline=false){c.save();c.translate(x,y);c.scale(s,s);c.beginPath();c.moveTo(0,17);c.bezierCurveTo(-16,4,-27,-4,-19,-17);c.bezierCurveTo(-12,-29,-1,-19,0,-13);c.bezierCurveTo(10,-31,29,-24,24,-8);c.bezierCurveTo(22,1,10,10,0,17);if(outline){c.lineWidth=4;c.strokeStyle=color;c.stroke()}else{c.fillStyle=color;c.fill()}c.restore()}
function waves(c){c.save();c.beginPath();c.moveTo(0,490);c.bezierCurveTo(115,489,133,590,272,600);c.bezierCurveTo(387,608,440,654,565,624);c.bezierCurveTo(730,570,811,669,932,584);c.bezierCurveTo(1020,533,1048,505,1122,529);c.lineTo(1122,759);c.bezierCurveTo(1030,747,948,626,833,669);c.bezierCurveTo(720,697,663,641,525,683);c.bezierCurveTo(362,742,269,604,148,660);c.bezierCurveTo(63,705,39,717,0,729);c.closePath();c.fillStyle="#d3e0c4";c.fill();c.beginPath();c.moveTo(0,592);c.bezierCurveTo(168,549,228,668,352,645);c.bezierCurveTo(489,621,630,708,757,636);c.bezierCurveTo(899,567,982,541,1122,565);c.lineTo(1122,718);c.bezierCurveTo(975,729,931,624,814,663);c.bezierCurveTo(665,717,557,669,441,696);c.bezierCurveTo(287,727,240,615,121,682);c.bezierCurveTo(70,706,36,724,0,738);c.closePath();c.fillStyle="#70966d";c.fill();c.restore()}
function footerWaves(c){c.beginPath();c.moveTo(0,1285);c.bezierCurveTo(148,1239,165,1412,372,1391);c.lineTo(0,1402);c.closePath();c.fillStyle="#cadbbb";c.fill();c.beginPath();c.moveTo(1122,1280);c.bezierCurveTo(966,1231,934,1424,784,1402);c.lineTo(1122,1402);c.closePath();c.fillStyle="#cadbbb";c.fill()}
function textBlock(c,text,x,top,maxW,maxLines,fontSize,lineHeight,weight,color){let rows=wrap(c,text,maxW,maxLines,fontSize,weight);rows.forEach((t,i)=>line(c,x,top+i*lineHeight,t,fontSize,color,weight,"left"))}
function drawPoster(c,data,img){
c.clearRect(0,0,W,H);c.fillStyle="#fffefa";c.fillRect(0,0,W,H);
const shine=c.createRadialGradient(580,640,80,580,640,790);shine.addColorStop(0,"#ffffff");shine.addColorStop(1,"#f6f7ed");c.fillStyle=shine;c.fillRect(0,0,W,H);
waves(c);footerWaves(c);
line(c,561,72,"VAQUINHA",106,green,950);line(c,561,170,"SOLIDÁRIA",104,sage,950);
for(const [x,y,a] of [[238,100,-1],[231,150,1],[878,102,1],[891,155,-1]]){c.save();c.translate(x,y);c.rotate(a*.36);round(c,-9,-25,18,50,10,"#f5aa29");c.restore()}
const title=(data.title||"Ajude esta campanha").trim();
const ts=fit(c,title,930,42,900),titleLines=wrap(c,title,930,2,ts,900);
titleLines.forEach((v,i)=>line(c,561,253+(i-(titleLines.length-1)/2)*46,v,ts,green,900));
round(c,248,320,626,356,28,"#ffffff","#f2f2e8",9);
c.save();c.beginPath();c.roundRect(263,335,596,325,20);c.clip();
if(img){const ratio=Math.max(596/img.width,325/img.height),dw=img.width*ratio,dh=img.height*ratio;c.drawImage(img,263+(596-dw)/2,335+Math.max(325-dh,Math.min(0,-(dh-325)*0.12)),dw,dh)}
else{const lg=c.createLinearGradient(263,335,859,660);lg.addColorStop(0,"#e3ebef");lg.addColorStop(1,"#d5e0e4");c.fillStyle=lg;c.fillRect(263,335,596,325);line(c,561,470,"♥",92,"#a6b8ad",800);line(c,561,557,"A SUA AJUDA FAZ",30,"#365b45",850);line(c,561,603,"A DIFERENÇA!",35,"#365b45",900)}c.restore();
heart(c,180,482,2.1,"#315b3a",true);heart(c,953,445,1.6,gold);heart(c,900,523,1.4,gold);
const intro=(data.intro||"").trim(),need=(data.need||"").trim();
function infoBox(top,height,label,value){
  round(c,77,top,968,height,20,"#fff","#c9d9c4",2);
  round(c,77,top,9,height,5,"#245c4a");
  line(c,104,top+28,label,23,green,900,"left");
  let fs=28,rows=[],lh=36;
  while(fs>=19){lh=Math.round(fs*1.25);rows=wrap(c,value||"Informe os detalhes da campanha.",900,8,fs,600);if(rows.length*lh<=height-63)break;fs--}
  rows.forEach((t,i)=>line(c,104,top+66+i*lh,t,fs,"#314b3b",600,"left"));
}
infoBox(707,126,"O QUE ACONTECEU",intro);
infoBox(844,151,"CUIDADOS NECESSÁRIOS",need);
round(c,77,1007,968,112,20,"#e8f3e5","#96b49e",3);
round(c,91,1019,88,88,44,"#245c4a");line(c,135,1063,"◆",56,"#fff",800);
line(c,204,1034,"CHAVE PIX · COPIE PARA DOAR",23,green,900,"left");
const pix=(data.pix||"CHAVE PIX DA CAMPANHA").trim();
const pixSize=fit(c,pix,798,38,900);
line(c,204,1081,pix,pixSize,green,900,"left");
round(c,77,1131,968,106,20,"#fff","#e2d1ac",2);
round(c,91,1139,86,86,43,"#2c5932");line(c,134,1182,"☎",50,"#fff",800);
line(c,204,1159,"WHATSAPP PARA CONTATO",22,green,900,"left");
const tel=(data.whatsapp||"WHATSAPP PARA CONTATO").trim();
line(c,204,1200,tel,fit(c,tel,790,31,800),green,800,"left");
const grad=c.createLinearGradient(180,0,942,0);grad.addColorStop(0,"#efb03c");grad.addColorStop(1,"#cf891b");round(c,178,1274,766,94,50,grad);heart(c,292,1320,1.4,"#fff");line(c,625,1322,"DOE E COMPARTILHE",44,"#fff",900);
line(c,561,1387,"Feito por GEB Tecnologia",20,"#365a49",500);
}
async function loadImage(src){if(!src)return null;return await new Promise(resolve=>{const im=new Image();im.crossOrigin="anonymous";im.onload=()=>resolve(im);im.onerror=()=>resolve(null);im.src=src;setTimeout(()=>resolve(null),8000)})}
async function render(data){const canvas=document.createElement("canvas");canvas.width=W;canvas.height=H;const c=canvas.getContext("2d");drawPoster(c,data,await loadImage(data.image));return canvas}
function attach({container,button,getData}){const host=document.getElementById(container),btn=document.getElementById(button);if(!host||!btn)return;let seq=0;const preview=document.createElement("img");preview.alt="Arte personalizada da vaquinha solidária";preview.style.cssText="display:block;width:100%;height:auto;max-width:480px;margin:0 auto;border-radius:12px;box-shadow:0 12px 35px #143a241c";host.appendChild(preview);
async function refresh(){const n=++seq;try{const canvas=await render(getData());if(n===seq){preview.src=canvas.toDataURL("image/png");btn.disabled=false}}catch(e){if(n===seq){btn.disabled=true;host.setAttribute("data-error","Não foi possível carregar a arte.")}}}
btn.addEventListener("click",async()=>{btn.disabled=true;const old=btn.textContent;btn.textContent="Preparando imagem…";try{const canvas=await render(getData());const blob=await new Promise(resolve=>canvas.toBlob(resolve,"image/png"));if(!blob)throw Error("Falha na imagem");const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="arte-vaquinha-solidaria.png";document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000)}catch(e){alert("Não foi possível salvar a imagem. Verifique se a foto permite uso por outros sites.")}finally{btn.textContent=old;btn.disabled=false}});
return {refresh};}
window.GEBVaquinhaArte={attach};
})();