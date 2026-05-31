# ConTrackr — Corrections Summary (v2.0)

This document describes every logic error found in the original codebase and how each was corrected to match the PDF system proposal.

---

## DATABASE (contrackr.sql)

### 1. Wrong MR Status Values
**Before:** `pending`, `approved`, `partially_issued`, `issued`, `cancelled`  
**After:** `available_for_issuance`, `pending_procurement`, `partially_fulfilled`, `fulfilled`, `cancelled`  
**Reason:** Per PDF §4.1 and Scenario 1, the system must distinguish between "sufficient stock (ready to issue)" and "insufficient stock (needs procurement)". The old statuses did not capture this correctly.

### 2. Wrong PR Status Flow (Two-Level Approval)
**Before:** `pending → manager_approved → approved → rejected`  
**After:** `pending → approved → rejected`  
**Reason:** The PDF specifies a single-level approval by the Project Manager/President. There is no two-step manager → president approval chain.

### 3. PO Default Status
**Before:** `pending` (required a separate "Sign PO" step)  
**After:** `signed` (Manager creates and signs simultaneously, per PDF §4.3.4)  
**Reason:** Per the PDF, the Manager creates AND signs the PO at the same time.

### 4. Missing `executed_by` on Transfers
**Before:** No column to record who physically executed the transfer  
**After:** `executed_by INT` column added, referencing `users.id`  
**Reason:** Warehouse Manager executes transfers as a separate step from Manager approval.

### 5. Wrong Transaction Types for Transfers
**Before:** Single `TRANSFER` type  
**After:** `TRANSFER_OUT` (from source) and `TRANSFER_IN` (to destination) as separate records  
**Reason:** The audit trail must show both sides of a transfer independently.

### 6. Broken Trigger Removed
**Before:** A MySQL trigger on `inventory_transactions` tried to update stock — broken syntax, no error handling, no transaction support.  
**After:** Trigger removed. All inventory updates are handled at the application layer with proper transactions and error handling.

---

## BACKEND ROUTES

### 7. `materialRequests.js` — Auto Stock-Out on MR Create
**Before:** Creating an MR automatically deducted stock from the warehouse.  
**After:** Creating an MR only checks inventory and sets a status flag. Actual stock-out is performed separately by the Warehouse Manager.  
**Reason:** Per PDF §4.1-4.2, the MR creation step is separate from the issuance step.

### 8. `materialRequests.js` — Auto PR Creation on MR Submit
**Before:** If stock was insufficient, a Purchase Request was auto-created by the system.  
**After:** No auto PR creation. The system flags the MR as `pending_procurement` so the Procurement Officer can create the PR manually.  
**Reason:** Per PDF §4.3.1, the Procurement Officer creates the PR — it is not auto-generated.

### 9. `materialRequests.js` — New Endpoints Added
**Added:** `GET /api/mr/pending-procurement` — lists MRs needing a PR  
**Added:** `GET /api/mr/available-issuance` — lists MRs ready for Warehouse issuance  

### 10. `inventory.js` — Stock-Out Not Tracking Project
**Before:** Stock-out only deducted from warehouse but never added to project inventory.  
**After:** Stock-out deducts from warehouse (project_id = NULL) AND adds to project inventory.  
**Reason:** Per PDF Scenario 1, after issuance the materials are tracked at the project level.

### 11. `inventory.js` — Missing Low-Stock Alert
**Before:** No low-stock detection after stock-out.  
**After:** After each stock-out, warehouse quantity is compared to `reorder_level`; if low, a `lowStockAlert` is returned in the response.  
**Reason:** Per PDF §4.6, the system must alert for low stock so procurement can be initiated.

### 12. `procurement.js` — Two-Level PR Approval Removed
**Before:** `PUT /api/procurement/pr/:id/manager-approve` and `PUT /api/procurement/pr/:id/president-approve` (two steps)  
**After:** `PUT /api/procurement/pr/:id/approve` with `{ action: 'approve' | 'reject' }` (single step by Manager)  
**Reason:** Single-level approval per PDF §4.3.2.

### 13. `procurement.js` — Wrong PO Creator Role
**Before:** Procurement Officer could create POs.  
**After:** Only Project Manager and Administrator can create POs.  
**Reason:** Per PDF §4.3.4, the Manager/President creates and signs the PO.

### 14. `procurement.js` — PO Status Default
**Before:** PO created as `pending`; required separate Sign step.  
**After:** PO created directly as `signed` (Manager creates + signs in one action).  

### 15. `procurement.js` — Canvass Validation
**Before:** Canvass entries accepted for any PR.  
**After:** Canvass entries only accepted for `approved` PRs.  

### 16. `transfers.js` — Combined Approve + Execute
**Before:** Approving a transfer immediately moved stock.  
**After:** Approval (Manager) and execution (Warehouse Manager) are separate endpoints:  
  - `PUT /api/transfers/:id/approve` — Manager approves (status → 'approved', no stock movement)  
  - `PUT /api/transfers/:id/execute` — Warehouse Manager executes (stock moves, TRANSFER_OUT + TRANSFER_IN logged)  
**Reason:** Per PDF §4.5 and Scenario 4, these are two distinct workflow steps.

### 17. `deliveries.js` — Stock-In on Delivery Confirm
**Before:** No automatic stock-in when delivery was confirmed.  
**After:** On `PUT /api/deliveries/:id/confirm`, warehouse stock increases by `quantity_received` for each item, and IN transactions are logged.  
**Reason:** Per PDF Scenario 2 Step 6, delivery confirmation triggers inventory update.

### 18. `reports.js` — MySQL Compatibility
**Before:** Used PostgreSQL-specific syntax (`INTERVAL '30 days'`, `DATE_TRUNC`, etc.)  
**After:** Rewritten using MySQL syntax (`DATE_SUB(NOW(), INTERVAL 30 DAY)`, `DATE()`, `COALESCE`, etc.)

### 19. `reports.js` — Dashboard Status Counters
**Before:** Dashboard counted MRs with status `pending` (old value)  
**After:** Counts MRs with `available_for_issuance`, `pending_procurement`, `partially_fulfilled`; POs with `signed` status.

---

## FRONTEND PAGES

### 20. `MaterialRequests.jsx` — Status Color Map
**Before:** Referenced old status names (`pending`, `approved`)  
**After:** References new status names with human-readable labels  

### 21. `MaterialRequests.jsx` — Success Message
**Before:** Said "stock auto-issued" and "PR auto-generated"  
**After:** Correctly explains next steps (Warehouse Manager issues / Procurement Officer creates PR)  

### 22. `Procurement.jsx` — Two-Level Approval UI Removed
**Before:** Showed "Mgr Approve" then "Pres Approve" buttons  
**After:** Single "Approve" button by Manager  

### 23. `Procurement.jsx` — PO Creation Role Restriction
**Before:** Procurement Officer could see the "New PO" button  
**After:** Only Project Manager and Administrator see the "New PO" button  

### 24. `Transfers.jsx` — Execute Button Added
**Before:** No way for Warehouse Manager to execute an approved transfer  
**After:** "Execute" button appears for `Warehouse Manager` when transfer status is `approved`  

### 25. `Inventory.jsx` — Stock-Out Requires Project
**Before:** Stock-out form allowed "Warehouse" as destination (self-deduction)  
**After:** Stock-out requires a destination project (correct warehouse → project issuance flow)  

---

## SEED SCRIPT

### 26. Added `npm run seed`
**Added:** `backend/src/seed.js` script to set correct bcrypt password hashes for all default users  
**Credentials after seed:**
| Email                         | Password          | Role               |
|-------------------------------|-------------------|--------------------|
| admin@contrackr.com           | Admin@123         | Administrator      |
| manager@contrackr.com         | Manager@123       | Project Manager    |
| procurement@contrackr.com     | Procurement@123   | Procurement Officer|
| engineer@contrackr.com        | Engineer@123      | Site Engineer      |
| warehouse@contrackr.com       | Warehouse@123     | Warehouse Manager  |

Run the seed after importing the SQL schema: `cd backend && npm run seed`

---

*All corrections are backwards-compatible with the existing UI structure.*
