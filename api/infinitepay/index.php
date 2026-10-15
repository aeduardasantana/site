<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
$config=__DIR__.'/_private/config.php';
if(!is_file($config)){http_response_code(503);echo json_encode(['error'=>'Integração ainda não configurada']);exit;}
$cfg=require $config;
$handle=$cfg['handle']??'';
if(!$handle){http_response_code(503);echo json_encode(['error'=>'Checkout indisponível']);exit;}
$dir=__DIR__.'/_data';
if(!is_dir($dir))mkdir($dir,0700,true);
$action=$_GET['action']??'';
function respond(array $a,int $status=200):void{http_response_code($status);echo json_encode($a,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);exit;}
function postjson():array{$raw=file_get_contents('php://input');if(strlen($raw)>20000)respond(['error'=>'Dados muito extensos'],413);$j=json_decode($raw,true);return is_array($j)?$j:[];}
function pathof(string $id):string{global $dir;if(!preg_match('/^[a-f0-9]{32}$/',$id))respond(['error'=>'Pedido inválido'],400);return $dir.'/'.$id.'.json';}
function loadorder(string $id):array{$p=pathof($id);if(!is_file($p))respond(['error'=>'Pedido não encontrado'],404);$v=json_decode(file_get_contents($p),true);if(!is_array($v))respond(['error'=>'Pedido indisponível'],503);return $v;}
function saveorder(string $id,array $data):void{$p=pathof($id);$tmp=tempnam(dirname($p),'tmp');file_put_contents($tmp,json_encode($data,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES),LOCK_EX);chmod($tmp,0600);rename($tmp,$p);}
function api(string $endpoint,array $payload):array{$ch=curl_init('https://api.checkout.infinitepay.io/'.$endpoint);curl_setopt_array($ch,[CURLOPT_POST=>true,CURLOPT_HTTPHEADER=>['Content-Type: application/json'],CURLOPT_POSTFIELDS=>json_encode($payload),CURLOPT_RETURNTRANSFER=>true,CURLOPT_TIMEOUT=>12,CURLOPT_CONNECTTIMEOUT=>5]);$body=curl_exec($ch);$code=curl_getinfo($ch,CURLINFO_HTTP_CODE);curl_close($ch);$j=json_decode((string)$body,true);if($body===false||$code<200||$code>=300||!is_array($j))respond(['error'=>'Falha de comunicação com o pagamento'],502);return $j;}
function verify(string $id,string $transaction,string $slug):bool{global $handle;if(!$transaction||!$slug||strlen($transaction)>160||strlen($slug)>160)return false;$order=loadorder($id);$data=api('payment_check',['handle'=>$handle,'order_nsu'=>$id,'transaction_nsu'=>$transaction,'slug'=>$slug]);if(($data['success']??false)!==true||($data['paid']??false)!==true||intval($data['amount']??0)!==1000)return false;$order['paid']=true;$order['transaction']=$transaction;$order['slug']=$slug;$order['paid_at']=gmdate('c');saveorder($id,$order);return true;}
if($action==='checkout'){
 if($_SERVER['REQUEST_METHOD']!=='POST')respond(['error'=>'Método inválido'],405);
 $data=postjson();$limits=['title'=>110,'intro'=>450,'need'=>900,'story'=>2200,'pix'=>180,'whatsapp'=>25,'image'=>2000];
 foreach($limits as $k=>$max){if(!isset($data[$k])||!is_string($data[$k])||mb_strlen($data[$k])>$max)respond(['error'=>'Campo inválido: '.$k],400);$data[$k]=trim($data[$k]);}
 foreach(['title','intro','need','story','pix','whatsapp'] as $k){if($data[$k]==='')respond(['error'=>'Preencha os campos obrigatórios'],400);}
 if(!preg_match('/^\d{10,13}$/',preg_replace('/\D/','',$data['whatsapp'])))respond(['error'=>'WhatsApp inválido'],400);
 if($data['image']!==''&&!filter_var($data['image'],FILTER_VALIDATE_URL))respond(['error'=>'Imagem inválida'],400);
 if($data['image']!==''&&strtolower(parse_url($data['image'],PHP_URL_SCHEME)??'')!=='https')respond(['error'=>'Imagem deve usar HTTPS'],400);
 $id=bin2hex(random_bytes(16));$order=['data'=>$data,'paid'=>false,'created'=>time(),'price'=>1000];saveorder($id,$order);
 $origin='https://site.compassrosesystems.com.br';
 $payment=api('links',['handle'=>$handle,'items'=>[['quantity'=>1,'price'=>1000,'description'=>'Criacao de campanha solidaria']],'order_nsu'=>$id,'redirect_url'=>$origin.'/vaquinha/pagamento/?pedido='.$id,'webhook_url'=>$origin.'/api/infinitepay/index.php?action=webhook']);
 $url=$payment['url']??$payment['link']??'';
 if(!is_string($url)||!filter_var($url,FILTER_VALIDATE_URL)||parse_url($url,PHP_URL_SCHEME)!=='https')respond(['error'=>'Não foi possível gerar checkout'],502);
 respond(['checkout_url'=>$url,'order_nsu'=>$id]);
}
if($action==='webhook'){
 if($_SERVER['REQUEST_METHOD']!=='POST')respond(['error'=>'Método inválido'],405);
 $v=postjson();$id=(string)($v['order_nsu']??'');$tx=(string)($v['transaction_nsu']??'');$slug=(string)($v['invoice_slug']??$v['slug']??'');
 if(!preg_match('/^[a-f0-9]{32}$/',$id))respond(['error'=>'Pedido inválido'],400);
 if(verify($id,$tx,$slug))respond(['ok'=>true]);respond(['error'=>'Pagamento não confirmado'],400);
}
if($action==='status'){
 $id=(string)($_GET['pedido']??'');$o=loadorder($id);
 if(($o['paid']??false)===true)respond(['paid'=>true,'url'=>'https://site.compassrosesystems.com.br/vaquinha/minhacampanha/?campanha='.$id]);
 $tx=(string)($_GET['transaction_nsu']??'');$slug=(string)($_GET['slug']??'');
 if($tx!==''&&$slug!==''&&verify($id,$tx,$slug))respond(['paid'=>true,'url'=>'https://site.compassrosesystems.com.br/vaquinha/minhacampanha/?campanha='.$id]);
 respond(['paid'=>false]);
}
if($action==='campaign'){
 $o=loadorder((string)($_GET['id']??''));
 if(($o['paid']??false)!==true)respond(['error'=>'Campanha indisponível'],404);
 respond(['data'=>$o['data']]);
}
respond(['error'=>'Operação desconhecida'],404);
