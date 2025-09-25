# Hastane Randevu Sistemi

Bu proje, hastaneler için randevu yönetimi sağlayan bir web uygulamasıdır. Kullanıcılar randevularını görebilir, iptal edebilir; adminler ise doktor ve klinik yönetimi yapabilir.

## Özellikler

- **Kullanıcı Randevu Yönetimi**: Gelecek ve geçmiş randevuların listelenmesi, randevu iptali.
- **Admin Paneli**: Doktor ve klinik ekleme, silme işlemleri.
- **Form Doğrulama**: React Hook Form ve Zod ile form doğrulama.
- **Güvenlik**: Admin giriş işlemleri güvenli bir şekilde yönetilir.
- **Veritabanı**: Supabase veya PostgreSQL ile veri yönetimi.

## Kullanılan Teknolojiler

- **Next.js** – React tabanlı sunucu tarafı render ve frontend.
- **React** – Kullanıcı arayüzü.
- **TailwindCSS** – Stil ve layout yönetimi.
- **Supabase / PostgreSQL** – Kullanıcı, doktor, klinik ve randevu verileri.
- **Prisma** – Veritabanı ORM.
- **Radix UI** – UI bileşenleri (Card, Select, ScrollArea vs.).
- **React Hook Form & Zod** – Form yönetimi ve doğrulama.
- **Bcrypt & JWT** – Şifreleme ve kullanıcı doğrulama.
- **Lucide React** – Icon yönetimi.
- **Sonner** – Toast bildirimleri.

## Kurulum

1. Depoyu klonlayın:

```bash
git clone https://github.com/kullaniciadi/hastane-randevu.git
cd hastane-randevu
