const { conn } = require("../../db.js");

async function loadTenants() {
  console.log("⏳ Ejecutando seed de Tenants...");

  const SQL = `
    -- 1️⃣ Insertar Tenant si no existe
    INSERT INTO "Tenants" (dni, nombre, telefono, mail, rol, password, activo, "createdAt", "updatedAt")
    SELECT
      44519000,
      'Juan Pérez',
      '3511234567',
      'juan@example.com',
      'Master',
      '123456',
      true,
      NOW(),
      NOW()
    WHERE NOT EXISTS (
      SELECT 1 FROM "Tenants" WHERE dni = 44519000
    );

    -- 2️⃣ Insertar relación Tenant - Professional si no existe
    INSERT INTO "TenantProfessionals" (
      id,
      "TenantId",
      "ProfessionalDni",
      active,
      "createdAt",
      "updatedAt"
    )
    SELECT
      gen_random_uuid(),
      1,
      44519856,
      TRUE,
      NOW(),
      NOW()
    WHERE NOT EXISTS (
      SELECT 1
      FROM "TenantProfessionals"
      WHERE "TenantId" = 1 AND "ProfessionalDni" = 44519856
    );

    -- 3️⃣ Insertar TenantClients masivamente si no existen
    INSERT INTO "TenantClients" ("id", "TenantId", "ClientDni", "active", "createdAt", "updatedAt")
    SELECT uuid_generate_v4(), 1, dni, true, NOW(), NOW()
    FROM "Clients" c
    WHERE dni IN (
        28271453, 87654321, 45678901, 78901234, 98765432,
        65432109, 21098765, 54321098, 10325478, 87654309
    )
    AND NOT EXISTS (
        SELECT 1
        FROM "TenantClients" tc
        WHERE tc."TenantId" = 1 AND tc."ClientDni" = c.dni
    );
  `;

  try {
    await conn.query(SQL);
    console.log("✅ Seed de Tenants cargado correctamente.");
  } catch (error) {
    console.error("❌ Error ejecutando seed de Tenants:", error);
  }
}

module.exports = loadTenants;
