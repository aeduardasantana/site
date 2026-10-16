# Meu Site — infraestrutura CRS

Status: preparação técnica; NÃO é um editor operacional.

## Separação de responsabilidades
- GEB Tecnologia: seleção, revisão final, contato comercial, consentimento para Shopping do Blog GEB.
- CRS: armazenamento protegido, controle de acesso, publicação e editor do proprietário.
- Sites publicados: /meusite/{slug}/, sem marca ou anúncios de outros clientes.
- Editor: /meusite/{slug}/editar/ somente após implantação de autenticação e verificação de propriedade, nunca acesso por URL secreta ou telefone como senha.

## Fluxo de implantação necessário
1. Contratação confirmada e identificador único de pedido.
2. Dados recebidos por endpoint HTTPS com proteção CSRF, limites de taxa, validação e autenticação do proprietário.
3. Upload direto seguro para área privada; verificar MIME real, extensão, dimensão, tamanho, desarmar metadados e converter para WebP; não aceitar SVG de terceiros sem sanitização especializada.
4. Persistência transacional MySQL, com credenciais em configuração privada fora da raiz pública.
5. Processo de publicação gera arquivos estáticos sanitizados por cliente; somente dados aprovados aparecem publicamente.
6. Editor autenticado modifica rascunho; publicação deve ser ação separada, com registro de versões e logs mínimos.

## Modelo funcional
site | catalogo; campos comuns: business_name, category, activity, city, uf, whatsapp, palette, logo_media_id?, hero_media_id?, title, description, services[], shopping_opt_in?.
Catálogo: items[] {name, note_or_price?, destination_url?}; validar URL http/https, bloquear esquemas inseguros, escapar HTML.
Toda alteração automática de texto deve respeitar bloqueio de campos editados manualmente.

## Segurança e privacidade
Credenciais MySQL não podem entrar no GitHub ou página pública. Dados pessoais devem ser mínimos; duração de retenção e exclusão devem ser definidas. Usar password_hash/password_verify ou provedor de identidade apropriado; sessão HTTPOnly+Secure+SameSite, tokens CSRF, proteção contra enumeração de contas, limites de tentativa, recuperação segura de acesso.

## Estado atual
Este documento prepara a implementação. Não existe autenticação de cliente, upload persistente, API de criação ou publicação automática operacionais. A tela de revisão comercial fica no GEB Tecnologia; logomarca e imagem só existem no navegador durante a demonstração.
