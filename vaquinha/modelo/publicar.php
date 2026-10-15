<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
$config=__DIR__.'/../../api/infinitepay/_private/config.php';
$settings=is_file($config)?require $config:[];
$hash=(string)($settings['admin_hash']??'');
$password=$_SERVER['PHP_AUTH_PW']??null;
if($password===null && isset($_SERVER['HTTP_AUTHORIZATION']) && str_starts_with($_SERVER['HTTP_AUTHORIZATION'],'Basic ')) {
 $decoded=base64_decode(substr($_SERVER['HTTP_AUTHORIZATION'],6),true);
 if($decoded!==false)$password=explode(':',$decoded,2)[1]??null;
}
if(!$hash||!is_string($password)||!password_verify($password,$hash)){http_response_code(401);header('WWW-Authenticate: Basic realm="GEB Interno"');echo '{"error":"Não autorizado"}';exit;}
if($_SERVER['REQUEST_METHOD']!=='POST'){http_response_code(405);exit;}
$raw=file_get_contents('php://input');
if(strlen($raw)>20000){http_response_code(413);exit;}
$j=json_decode($raw,true);
if(!is_array($j)||!is_bool($j['publish']??null)){http_response_code(400);echo '{"error":"Escolha de divulgação obrigatória"}';exit;}
$fields=['title'=>110,'intro'=>450,'need'=>900,'story'=>2200,'pix'=>180,'whatsapp'=>25,'image'=>2000];
$data=[];
foreach($fields as $k=>$max) {
 $v=$j['data'][$k]??null;
 if(!is_string($v)||mb_strlen($v)>$max){http_response_code(400);echo '{"error":"Dados inválidos"}';exit;}
 $data[$k]=trim($v);
}
foreach(['title','intro','need','story','pix','whatsapp'] as $key){if($data[$key]===''){http_response_code(400);echo '{"error":"Preencha os campos"}';exit;}}
if($data['image']!==''&&(!filter_var($data['image'],FILTER_VALIDATE_URL)||parse_url($data['image'],PHP_URL_SCHEME)!=='https')){http_response_code(400);echo '{"error":"Imagem inválida"}';exit;}
$id=bin2hex(random_bytes(16));
$dir=__DIR__.'/../../api/infinitepay/_data';
if(!is_dir($dir))mkdir($dir,0700,true);
$record=['internal'=>true,'paid'=>false,'listing'=>$j['publish'],'created'=>time(),'data'=>$data];
$file=$dir.'/'.$id.'.json';
if(file_put_contents($file,json_encode($record,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES),LOCK_EX)===false){http_response_code(503);echo '{"error":"Erro ao salvar campanha"}';exit;}
chmod($file,0600);
echo json_encode(['url'=>'https://site.compassrosesystems.com.br/vaquinha/minhacampanha/?campanha='.$id],JSON_UNESCAPED_SLASHES);
