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
line(c,561,72,"VAQUINHA",106,green,950);
line(c,561,170,"SOLIDÁRIA",104,sage,950);
for(const [x,y,a] of [[238,100,-1],[231,150,1],[878,102,1],[891,155,-1]]){c.save();c.translate(x,y);c.rotate(a*.36);round(c,-9,-25,18,50,10,"#f5aa29");c.restore()}
round(c,175,230,770,110,27,"#dce6ce");
line(c,560,254,"TÍTULO DA VAQUINHA",27,green,900);
round(c,193,270,734,59,19,"white","#e0e6d4",2);
const title=(data.title||"TÍTULO DA CAMPANHA").trim();let ts=fit(c,title,686,32);let titleLines=wrap(c,title,688,2,ts,800);titleLines.forEach((v,i)=>line(c,560,300+(i-(titleLines.length-1)/2)*25,v,ts,green,800));
round(c,287,352,536,348,27,"#ffffff","#f5f5ee",10);
c.save();c.beginPath();c.roundRect(307,370,496,311,18);c.clip();if(img){const ratio=Math.max(496/img.width,311/img.height);const dw=img.width*ratio,dh=img.height*ratio;c.drawImage(img,307+(496-dw)/2,370+(311-dh)/2,dw,dh)}else{const lg=c.createLinearGradient(307,370,803,680);lg.addColorStop(0,"#e3ebef");lg.addColorStop(1,"#d5e0e4");c.fillStyle=lg;c.fillRect(307,370,496,311);c.fillStyle="#9eafa7";c.beginPath();c.arc(605,456,29,0,Math.PI*2);c.fill();c.beginPath();c.moveTo(432,555);c.lineTo(492,478);c.quadraticCurveTo(504,463,519,480);c.lineTo(563,525);c.quadraticCurveTo(579,540,591,527);c.lineTo(615,507);c.quadraticCurveTo(627,497,641,515);c.lineTo(676,558);c.closePath();c.fill();line(c,555,603,"FOTO DA",34,"#465b59",750);line(c,555,644,"CAMPANHA",34,"#465b59",750)}c.restore();
heart(c,203,471,2.2,"#315b3a",true);heart(c,950,428,1.65,gold);heart(c,884,511,1.5,gold);
round(c,130,724,440,62,29,"#dce6cc");line(c,347,752,"NECESSIDADE / RESUMO",29,green,900);
round(c,130,759,860,198,23,"#ffffff","#d1d5ab",2);
textBlock(c,data.need||data.intro||"Descreva a necessidade da campanha.",155,800,804,5,29,34,600,"#365044");
round(c,130,970,860,111,23,"#ffffff","#e2d1ac",2);
round(c,147,977,95,95,47,"#2c5932");
line(c,195,1025,"◆",64,"#ffffff",800);
line(c,300,996,"CHAVE PIX",25,green,900,"left");
round(c,298,1017,664,49,14,"#ffffff","#dfe3d9",2);
const pix=(data.pix||"CHAVE PIX DA CAMPANHA").trim();textBlock(c,pix,315,1041,625,1,fit(c,pix,622,23,650),27,650,"#314b3b");
round(c,130,1090,860,111,23,"#ffffff","#e2d1ac",2);
round(c,147,1099,95,95,47,"#2c5932");line(c,195,1147,"☎",55,"#ffffff",800);
line(c,300,1118,"WHATSAPP",25,green,900,"left");
round(c,298,1138,664,49,14,"#ffffff","#dfe3d9",2);
textBlock(c,data.whatsapp||"WHATSAPP PARA CONTATO",315,1162,625,1,24,28,650,"#314b3b");
const grad=c.createLinearGradient(180,0,942,0);grad.addColorStop(0,"#efb03c");grad.addColorStop(1,"#cf891b");round(c,179,1220,765,102,55,grad);heart(c,290,1270,1.45,"#ffffff");line(c,625,1272,"DOE E COMPARTILHE",46,"#ffffff",900);
line(c,561,1367,"Feito por GEB Tecnologia",21,"#365a49",500);
}
async function loadImage(src){if(!src)return null;return await new Promise(resolve=>{const im=new Image();im.crossOrigin="anonymous";im.onload=()=>resolve(im);im.onerror=()=>resolve(null);im.src=src;setTimeout(()=>resolve(null),8000)})}
async function render(data){const canvas=document.createElement("canvas");canvas.width=W;canvas.height=H;const c=canvas.getContext("2d");drawPoster(c,data,await loadImage(data.image));return canvas}
function attach({container,button,getData}){const host=document.getElementById(container),btn=document.getElementById(button);if(!host||!btn)return;let seq=0;const preview=document.createElement("img");preview.alt="Arte personalizada da vaquinha solidária";preview.style.cssText="display:block;width:100%;height:auto;max-width:480px;margin:0 auto;border-radius:12px;box-shadow:0 12px 35px #143a241c";host.appendChild(preview);
async function refresh(){const n=++seq;try{const canvas=await render(getData());if(n===seq){preview.src=canvas.toDataURL("image/png");btn.disabled=false}}catch(e){if(n===seq){btn.disabled=true;host.setAttribute("data-error","Não foi possível carregar a arte.")}}}
btn.addEventListener("click",async()=>{btn.disabled=true;const old=btn.textContent;btn.textContent="Preparando imagem…";try{const canvas=await render(getData());const blob=await new Promise(resolve=>canvas.toBlob(resolve,"image/png"));if(!blob)throw Error("Falha na imagem");const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="arte-vaquinha-solidaria.png";document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000)}catch(e){alert("Não foi possível salvar a imagem. Verifique se a foto permite uso por outros sites.")}finally{btn.textContent=old;btn.disabled=false}});
return {refresh};}
window.GEBVaquinhaArte={attach};
})();