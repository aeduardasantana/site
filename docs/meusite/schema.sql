-- Meu Site: proposta de esquema MySQL para revisão antes de migração.
-- NÃO executar em produção sem definir autenticação, backups, migrações e política de acesso.
CREATE TABLE ms_sites (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 owner_user_id BIGINT UNSIGNED NOT NULL,
 slug VARCHAR(100) NOT NULL UNIQUE,
 model ENUM('site','catalogo') NOT NULL,
 business_name VARCHAR(150) NOT NULL,
 category VARCHAR(110) NOT NULL,
 activity VARCHAR(140) NOT NULL,
 city VARCHAR(120), uf CHAR(2), whatsapp VARCHAR(20),
 palette VARCHAR(30) NOT NULL DEFAULT 'oceano',
 logo_media_id BIGINT UNSIGNED NULL,
 hero_media_id BIGINT UNSIGNED NULL,
 title VARCHAR(180), description TEXT,
 shopping_opt_in BOOLEAN NOT NULL DEFAULT FALSE,
 status ENUM('draft','pending_review','published','suspended') NOT NULL DEFAULT 'draft',
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE ms_content_items (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 site_id BIGINT UNSIGNED NOT NULL,
 position INT UNSIGNED NOT NULL DEFAULT 0,
 name VARCHAR(180) NOT NULL,
 detail VARCHAR(350), destination_url VARCHAR(2048),
 selected BOOLEAN NOT NULL DEFAULT TRUE,
 description TEXT,
 CONSTRAINT fk_ms_items_site FOREIGN KEY(site_id) REFERENCES ms_sites(id) ON DELETE CASCADE,
 INDEX (site_id,position)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE ms_media (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 site_id BIGINT UNSIGNED NOT NULL,
 kind ENUM('logo','hero','other') NOT NULL,
 storage_key VARCHAR(300) NOT NULL,
 mime_type VARCHAR(80) NOT NULL,
 file_size BIGINT UNSIGNED NOT NULL,
 width INT UNSIGNED, height INT UNSIGNED,
 uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT fk_ms_media_site FOREIGN KEY(site_id) REFERENCES ms_sites(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE ms_revisions (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 site_id BIGINT UNSIGNED NOT NULL,
 author_user_id BIGINT UNSIGNED NOT NULL,
 snapshot_json JSON NOT NULL,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT fk_ms_revision_site FOREIGN KEY(site_id) REFERENCES ms_sites(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
