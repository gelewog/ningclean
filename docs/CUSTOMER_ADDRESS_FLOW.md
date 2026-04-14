# Customer & Booking Address Flow Analysis

## Pertanyaan:
1. Apakah customer baru dibuat untuk setiap booking?
2. Bagaimana kalau orang sama booking dengan alamat berbeda?
3. Relasi antara customer.addresses dan booking.address?

## Jawaban: FLOW LOGIC

### Scenario 1: Customer Baru (Email Belum Ada)

```
Booking #1: siti@email.com, Alamat: "Jl. Melati 1"
    ↓
Cek Database: siti@email.com ❌ TIDAK ADA
    ↓
CREATE new customer:
    - id: "cust-001" (NEW)
    - email: "siti@email.com"
    - source: "guest"
    - addresses: [{label: "Alamat Booking", address: "Jl. Melati 1"}]
    ↓
CREATE booking:
    - orderNumber: "NC-2026-0001"
    - customerId: "cust-001" ← link ke customer
    - address: "Jl. Melati 1, Surabaya" (full address with city)
```

### Scenario 2: Customer Sudah Ada, Booking Alamat BARU

```
Booking #2: siti@email.com, Alamat: "Jl. Anggrek 5" (alamat berbeda!)
    ↓
Cek Database: siti@email.com ✅ ADA!
    - id: "cust-001" (SAMA)
    - addresses: [{label: "Alamat Booking", address: "Jl. Melati 1"}]
    ↓
UPDATE customer (TIDAK create baru):
    - id: tetap "cust-001" (tidak berubah)
    - addresses: [
        {label: "Alamat Booking", address: "Jl. Melati 1"},  // ← address lama
        {label: "Alamat Booking", address: "Jl. Anggrek 5"}   // ← address BARU ditambahkan!
      ]
    ↓
CREATE booking:
    - orderNumber: "NC-2026-0002"
    - customerId: "cust-001" (SAMA customer!)
    - address: "Jl. Anggrek 5, Surabaya"
```

### Scenario 3: Customer Sudah Ada, Booking Alamat SAMA (Duplicate Prevention)

```
Booking #3: siti@email.com, Alamat: "Jl. Anggrek 5" (alamat sama dengan booking #2)
    ↓
Cek Database: siti@email.com ✅ ADA
    - addresses sudah ada "Jl. Anggrek 5"
    ↓
Check: addressExists("Jl. Anggrek 5")? ✅ YES
    ↓
SKIP update addresses (tidak ditambahkan lagi)
    ↓
CREATE booking:
    - orderNumber: "NC-2026-0003"
    - customerId: "cust-001" (SAMA customer)
    - address: "Jl. Anggrek 5, Surabaya"
```

## Visualisasi Database

### Tabel `customers`:

| id | email | name | source | addresses (JSONB) |
|----|-------|------|--------|-------------------|
| cust-001 | siti@email.com | Siti | guest | `[{"address":"Jl. Melati 1"}, {"address":"Jl. Anggrek 5"}]` |
| cust-002 | budi@email.com | Budi | guest | `[{"address":"Jl. Mawar 3"}]` |

**Satu baris = Satu customer = Satu email**

### Tabel `bookings`:

| orderNumber | customerId | address | serviceDate |
|-------------|------------|---------|-------------|
| NC-2026-0001 | cust-001 | Jl. Melati 1, Surabaya | 2026-04-14 |
| NC-2026-0002 | cust-001 | Jl. Anggrek 5, Surabaya | 2026-04-15 |
| NC-2026-0003 | cust-001 | Jl. Anggrek 5, Surabaya | 2026-04-16 |
| NC-2026-0004 | cust-002 | Jl. Mawar 3, Surabaya | 2026-04-17 |

**Banyak baris = Banyak booking = Bisa same customer**

## Perbedaan Field Address

### `customer.addresses` (Array)
- **Tujuan:** Historical record semua alamat customer
- **Use case:**
  - Dropdown "Pilih alamat yang pernah digunakan"
  - Customer bisa pilih alamat lama saat booking lagi
  - Analytics: customer paling banyak booking di alamat mana

### `booking.address` (String)
- **Tujuan:** Snapshot alamat saat booking dibuat
- **Use case:**
  - Invoice/Receipt menunjukkan alamat saat itu
  - Kalau customer edit alamat di profile, booking lama tetap valid
  - Proof of delivery

## Analogi Sederhana

**Seperti E-Commerce (Shopee/Tokopedia):**

```
Profil Anda (Customer):
    - Email: siti@email.com ✓
    - Alamat Tersimpan:
        1. Rumah (Jl. Melati 1)
        2. Kantor (Jl. Anggrek 5)
        3. Rumah Ortu (Jl. Mawar 3)

Order History (Bookings):
    - Order #001: Jl. Melati 1 (Rumah) ✓
    - Order #002: Jl. Anggrek 5 (Kantor) ✓
    - Order #003: Jl. Anggrek 5 (Kantor) ✓
    - Order #004: Jl. Mawar 3 (Rumah Ortu) ✓

→ Satu customer, banyak alamat, banyak order
→ Kalau pindah rumah, tambah alamat baru di profil
→ Order lama tetap pakai alamat lama (snapshot)
```

## Benefit Design Ini

1. ✅ **Customer Experience:** Bisa pilih dari alamat tersimpan
2. ✅ **Data Integrity:** Historical booking tetap valid
3. ✅ **Analytics:** Bisa analisis customer behavior per lokasi
4. ✅ **Flexibility:** Customer bisa punya rumah, kantor, proyek (multiple addresses)
5. ✅ **Deduplication:** Tidak ada customer duplicate per email

## Code Logic (Simplified)

```typescript
// Cari customer by email
const customer = await prisma.customer.findFirst({
  where: { email: email }
});

if (!customer) {
  // BARU: Create customer + addresses: [newAddress]
  customer = await prisma.customer.create({
    data: { email, addresses: [newAddress] }
  });
} else {
  // LAMA: Update addresses array (append)
  const addresses = [...customer.addresses, newAddress];
  await prisma.customer.update({
    where: { id: customer.id },
    data: { addresses }
  });
}

// Create booking (selalu baru)
await prisma.booking.create({
  data: {
    customerId: customer.id,  // Same customer
    address: fullAddress,      // Snapshot for this booking
  }
});
```

## Kesimpulan

| Pertanyaan | Jawaban |
|------------|---------|
| ID customer baru tiap booking? | **TIDAK** - Satu email = Satu customer |
| Address beda = customer baru? | **TIDAK** - Address ditambahkan ke customer existing |
| Referensi addresses? | **By Email** - Email adalah unique identifier |
| Kenapa perlu 2 address field? | **customer.addresses** = history, **booking.address** = snapshot |
