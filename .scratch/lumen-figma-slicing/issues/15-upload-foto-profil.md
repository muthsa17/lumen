# 15: Upload foto profil (✂️ bisa dipotong)

**Konteks (baca dulu):**
- Spec: `.scratch/lumen-figma-slicing/spec.md`
- Peta frame dan penyimpangan dari Figma: `.scratch/lumen-figma-slicing/figma-frames.md` (bagian frame terkait)
- Figma (file key `cEhdAQvduiD4OwOHK5UQdh`):
  - `166:1229`: https://www.figma.com/design/cEhdAQvduiD4OwOHK5UQdh/LUMEN-GCJ-2026--Copy-?node-id=166-1229
- Aturan repo: `CLAUDE.md` (tanpa `git commit`/`git push`, token design system, aksesibilitas)

**What to build:** Pengguna mengganti foto profil lewat "Ubah foto", lalu foto tampil di halaman profil dan di header.

**Blocked by:** 01, 14

**Status:** ready-for-agent

- [ ] Validasi di klien: JPG/GIF/PNG dan ≤1MB, dengan pesan lembut kalau ditolak
- [ ] Upload ke folder `<user_id>/` di bucket `avatars`; URL publik disimpan ke `user_metadata.avatar_url`
- [ ] Avatar di header dan profil memakai foto, dengan inisial sebagai cadangan kalau foto gagal dimuat
- [ ] Cek manual: tidak bisa menulis ke folder pengguna lain (RLS)
- [ ] Build, lint, dan tes lulus
