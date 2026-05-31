-- ============================================================
-- ConTrackr Database Schema (FIXED)
-- Construction Materials Delivery and Inventory Monitoring
-- Changes from original:
--   1. Added `notes` column to purchase_requests table
-- ============================================================

CREATE DATABASE IF NOT EXISTS contrackr_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE contrackr_db;

-- ============================================================
-- CORE TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    location VARCHAR(255) NOT NULL,
    status ENUM('active', 'completed', 'on_hold') DEFAULT 'active',
    start_date DATE,
    end_date DATE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS materials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    reorder_level DECIMAL(10,2) NOT NULL DEFAULT 0,
    description TEXT,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_reorder_level CHECK (reorder_level >= 0)
);

CREATE TABLE IF NOT EXISTS suppliers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    contact_info TEXT,
    email VARCHAR(150),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- TRANSACTION TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS material_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    requested_by INT NOT NULL,
    status ENUM('available_for_issuance', 'pending_procurement', 'partially_fulfilled', 'fulfilled', 'cancelled') DEFAULT 'pending_procurement',
    date_needed DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_mr_project FOREIGN KEY (project_id) REFERENCES projects(id),
    CONSTRAINT fk_mr_user FOREIGN KEY (requested_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS mr_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mr_id INT NOT NULL,
    material_id INT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    quantity_fulfilled DECIMAL(10,2) DEFAULT 0,
    status ENUM('pending', 'fulfilled', 'partially_fulfilled') DEFAULT 'pending',
    CONSTRAINT fk_mri_mr FOREIGN KEY (mr_id) REFERENCES material_requests(id) ON DELETE CASCADE,
    CONSTRAINT fk_mri_material FOREIGN KEY (material_id) REFERENCES materials(id),
    CONSTRAINT chk_mri_quantity CHECK (quantity > 0),
    CONSTRAINT chk_mri_qty_fulfilled CHECK (quantity_fulfilled >= 0)
);

-- FIX: Added `notes` column (was missing in original — sample step 3 requires notes on PR)
CREATE TABLE IF NOT EXISTS purchase_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mr_id INT,
    created_by INT NOT NULL,
    approved_by INT,
    status ENUM('pending', 'approved', 'rejected', 'ready_for_po') DEFAULT 'pending',
    rejection_reason TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_pr_mr FOREIGN KEY (mr_id) REFERENCES material_requests(id),
    CONSTRAINT fk_pr_creator FOREIGN KEY (created_by) REFERENCES users(id),
    CONSTRAINT fk_pr_approver FOREIGN KEY (approved_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS pr_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pr_id INT NOT NULL,
    material_id INT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    estimated_unit_cost DECIMAL(10,2),
    CONSTRAINT fk_pri_pr FOREIGN KEY (pr_id) REFERENCES purchase_requests(id) ON DELETE CASCADE,
    CONSTRAINT fk_pri_material FOREIGN KEY (material_id) REFERENCES materials(id),
    CONSTRAINT chk_pri_quantity CHECK (quantity > 0)
);

CREATE TABLE IF NOT EXISTS canvass_entries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pr_id INT NOT NULL,
    supplier_id INT NOT NULL,
    material_id INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    delivery_days INT NOT NULL DEFAULT 0,
    is_selected TINYINT(1) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ce_pr FOREIGN KEY (pr_id) REFERENCES purchase_requests(id),
    CONSTRAINT fk_ce_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
    CONSTRAINT fk_ce_material FOREIGN KEY (material_id) REFERENCES materials(id),
    CONSTRAINT chk_ce_price CHECK (unit_price >= 0),
    CONSTRAINT chk_ce_days CHECK (delivery_days >= 0)
);

CREATE TABLE IF NOT EXISTS purchase_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pr_id INT NOT NULL,
    supplier_id INT NOT NULL,
    created_by INT NOT NULL,
    signed_by INT,
    status ENUM('pending', 'signed', 'delivered', 'cancelled') DEFAULT 'pending',
    total_cost DECIMAL(12,2) NOT NULL DEFAULT 0,
    expected_delivery_date DATE,
    signed_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_po_pr FOREIGN KEY (pr_id) REFERENCES purchase_requests(id),
    CONSTRAINT fk_po_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
    CONSTRAINT fk_po_creator FOREIGN KEY (created_by) REFERENCES users(id),
    CONSTRAINT fk_po_signer FOREIGN KEY (signed_by) REFERENCES users(id),
    CONSTRAINT chk_po_cost CHECK (total_cost >= 0)
);

CREATE TABLE IF NOT EXISTS po_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    po_id INT NOT NULL,
    material_id INT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    CONSTRAINT fk_poi_po FOREIGN KEY (po_id) REFERENCES purchase_orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_poi_material FOREIGN KEY (material_id) REFERENCES materials(id),
    CONSTRAINT chk_poi_quantity CHECK (quantity > 0),
    CONSTRAINT chk_poi_price CHECK (unit_price >= 0)
);

-- Delivery status flow:
--   pending   → received  (Warehouse Manager: PUT /deliveries/:id/receive — triggers Stock-In)
--   received  → confirmed (Site Engineer:    PUT /deliveries/:id/confirm — engineer acknowledgement)
CREATE TABLE IF NOT EXISTS deliveries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    po_id INT NOT NULL,
    received_by INT,
    confirmed_by INT,
    delivery_date DATE NOT NULL,
    received_date DATETIME,
    status ENUM('pending', 'received', 'confirmed', 'rejected') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_del_po FOREIGN KEY (po_id) REFERENCES purchase_orders(id),
    CONSTRAINT fk_del_receiver FOREIGN KEY (received_by) REFERENCES users(id),
    CONSTRAINT fk_del_confirmer FOREIGN KEY (confirmed_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS delivery_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    delivery_id INT NOT NULL,
    material_id INT NOT NULL,
    quantity_ordered DECIMAL(10,2) NOT NULL,
    quantity_received DECIMAL(10,2) NOT NULL DEFAULT 0,
    CONSTRAINT fk_di_delivery FOREIGN KEY (delivery_id) REFERENCES deliveries(id) ON DELETE CASCADE,
    CONSTRAINT fk_di_material FOREIGN KEY (material_id) REFERENCES materials(id),
    CONSTRAINT chk_di_qty CHECK (quantity_received >= 0)
);

CREATE TABLE IF NOT EXISTS inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    material_id INT NOT NULL,
    project_id INT,
    quantity DECIMAL(10,2) NOT NULL DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_inv_material FOREIGN KEY (material_id) REFERENCES materials(id),
    CONSTRAINT fk_inv_project FOREIGN KEY (project_id) REFERENCES projects(id),
    CONSTRAINT uq_inv_material_project UNIQUE (material_id, project_id),
    CONSTRAINT chk_inv_quantity CHECK (quantity >= 0)
);

CREATE TABLE IF NOT EXISTS inventory_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('IN', 'OUT', 'TRANSFER_IN', 'TRANSFER_OUT') NOT NULL,
    material_id INT NOT NULL,
    project_id INT,
    quantity DECIMAL(10,2) NOT NULL,
    reference_id INT,
    reference_type VARCHAR(50),
    notes TEXT,
    created_by INT,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_it_material FOREIGN KEY (material_id) REFERENCES materials(id),
    CONSTRAINT fk_it_project FOREIGN KEY (project_id) REFERENCES projects(id),
    CONSTRAINT fk_it_user FOREIGN KEY (created_by) REFERENCES users(id),
    CONSTRAINT chk_it_quantity CHECK (quantity > 0)
);

CREATE TABLE IF NOT EXISTS transfers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    from_project_id INT,
    to_project_id INT NOT NULL,
    requested_by INT NOT NULL,
    approved_by INT,
    executed_by INT,
    status ENUM('pending', 'approved', 'rejected', 'completed') DEFAULT 'pending',
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approval_date TIMESTAMP,
    completion_date TIMESTAMP,
    rejection_reason TEXT,
    notes TEXT,
    CONSTRAINT fk_tr_from FOREIGN KEY (from_project_id) REFERENCES projects(id),
    CONSTRAINT fk_tr_to FOREIGN KEY (to_project_id) REFERENCES projects(id),
    CONSTRAINT fk_tr_requester FOREIGN KEY (requested_by) REFERENCES users(id),
    CONSTRAINT fk_tr_approver FOREIGN KEY (approved_by) REFERENCES users(id),
    CONSTRAINT fk_tr_executor FOREIGN KEY (executed_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS transfer_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transfer_id INT NOT NULL,
    material_id INT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_ti_transfer FOREIGN KEY (transfer_id) REFERENCES transfers(id) ON DELETE CASCADE,
    CONSTRAINT fk_ti_material FOREIGN KEY (material_id) REFERENCES materials(id),
    CONSTRAINT chk_ti_quantity CHECK (quantity > 0)
);

-- ============================================================
-- SEED DATA
-- ============================================================

INSERT IGNORE INTO roles (role_name) VALUES 
('Administrator'), 
('Project Manager'), 
('Procurement Officer'), 
('Site Engineer'), 
('Warehouse Manager');

-- Default users (passwords are plain-text; run seed.js to hash them before production use)
INSERT IGNORE INTO users (name, email, password, role_id) VALUES
('Admin User',       'admin@contrackr.com',       'Admin@123',       (SELECT id FROM roles WHERE role_name='Administrator')),
('Manager User',     'manager@contrackr.com',     'Manager@123',     (SELECT id FROM roles WHERE role_name='Project Manager')),
('Procurement User', 'procurement@contrackr.com', 'Procurement@123', (SELECT id FROM roles WHERE role_name='Procurement Officer')),
('Engineer User',    'engineer@contrackr.com',    'Engineer@123',    (SELECT id FROM roles WHERE role_name='Site Engineer')),
('Warehouse User',   'warehouse@contrackr.com',   'Warehouse@123',   (SELECT id FROM roles WHERE role_name='Warehouse Manager'));

INSERT IGNORE INTO materials (name, unit, reorder_level, category) VALUES
('Portland Cement (40kg)', 'bags', 500, 'Cement'),
('Rebar – 10 mm ∅ x 6 m', 'pcs', 800, 'Steel'),
('Rebar – 12 mm ∅ x 6 m', 'pcs', 800, 'Steel'),
('Rebar – 16 mm ∅ x 6 m', 'pcs', 500, 'Steel'),
('Rebar – 20 mm ∅ x 6 m', 'pcs', 500, 'Steel'),
('G.I. Tie Wire', 'kg', 100, 'Steel'),
('Phenolic Board 1/2"', 'sheets', 200, 'Wood/Board'),
('CHB 4"', 'pcs', 500, 'Concrete Blocks'),
('Tile Grout', 'bags', 100, 'Tiles'),
('Tile Adhesive', 'bags', 200, 'Tiles'),
('Flat Latex Paint', 'pcs', 70, 'Paint'),
('Masonry Neutralizer', 'pcs', 90, 'Chemicals'),
('Masonry Putty', 'pcs', 50, 'Chemicals');

INSERT IGNORE INTO projects (name, location, description) VALUES
('Three-storey College Building', 'Campus Area', 'Academic building construction'),
('Food Processing Building', 'Campus Area', 'Construction of food processing lab'),
('Faculty Parking Area', 'Campus Area', 'Parking lot construction'),
('Perimeter Fence', 'Campus Area', 'Construction of perimeter fencing');

INSERT IGNORE INTO suppliers (name, contact_info, email, address) VALUES
('RC Ramirez Enterprises Construction Supply', '0912-111-2222', 'rc.ramirez@gmail.com', 'City A'),
('Rural Sagbat Construction Supplies Trading', '0912-333-4444', 'rural.sagbat@gmail.com', 'City B'),
('Evergreen Trading Construction Supply', '0912-555-6666', 'evergreen.trading@gmail.com', 'City C'),
('Lucky Way Enterprise', '0912-777-8888', 'lucky.way@gmail.com', 'City D'),
('BTC Construction Supplies', '0912-999-0000', 'btc.supplies@gmail.com', 'City E');

-- Warehouse inventory (project_id IS NULL = central warehouse)
INSERT IGNORE INTO inventory (material_id, project_id, quantity) VALUES
((SELECT id FROM materials WHERE name='Portland Cement (40kg)'), NULL, 500),
((SELECT id FROM materials WHERE name='Rebar – 10 mm ∅ x 6 m'), NULL, 800),
((SELECT id FROM materials WHERE name='Rebar – 12 mm ∅ x 6 m'), NULL, 800),
((SELECT id FROM materials WHERE name='Rebar – 16 mm ∅ x 6 m'), NULL, 500),
((SELECT id FROM materials WHERE name='Rebar – 20 mm ∅ x 6 m'), NULL, 500),
((SELECT id FROM materials WHERE name='G.I. Tie Wire'), NULL, 100),
((SELECT id FROM materials WHERE name='Phenolic Board 1/2"'), NULL, 200),
((SELECT id FROM materials WHERE name='CHB 4"'), NULL, 500),
((SELECT id FROM materials WHERE name='Tile Grout'), NULL, 100),
((SELECT id FROM materials WHERE name='Tile Adhesive'), NULL, 200),
((SELECT id FROM materials WHERE name='Flat Latex Paint'), NULL, 70),
((SELECT id FROM materials WHERE name='Masonry Neutralizer'), NULL, 90),
((SELECT id FROM materials WHERE name='Masonry Putty'), NULL, 50);
