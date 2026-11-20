# 14: Profil: nama, bidang, dan email

**Konteks (baca dulu):**
- Spec: `.scratch/lumen-figma-slicing/spec.md`
- Peta frame dan penyimpangan dari Figma: `.scratch/lumen-figma-slicing/figma-frames.md` (bagian frame terkait)
- Figma (file key `cEhdAQvduiD4OwOHK5UQdh`):
  - `166:1229`: https://www.figma.com/design/cEhdAQvduiD4OwOHK5UQdh/LUMEN-GCJ-2026--Copy-?node-id=166-1229
- Aturan repo: `CLAUDE.md` (tanpa `git commit`/`git push`, token design system, aksesibilitas)

**What to build:** Di `/profile` (frame `166:1229`), pengguna mengubah nama lengkap, pekerjaan/bidang, dan email. Nama dan inisial di header ikut berubah.

**Blocked by:** 06

**Status:** ready-for-agent

- [ ] Layout "Akun & Preferensi" dengan tab vertikal; hanya Profil (dan Keamanan dari tiket 16) yang tampil
- [ ] Simpan `full_name` dan `occupation` ke `user_metadata`; header ikut diperbarui
- [ ] Ganti email lewat `updateUser({ email })` dengan pesan bahwa konfirmasi dikirim ke email baru
- [ ] Tamu melihat ajakan upgrade akun (memakai dialog upgrade yang ada)
- [ ] Avatar menampilkan inisial
- [ ] Kolom bertumpuk di mobile
- [ ] Build, lint, dan tes lulus
