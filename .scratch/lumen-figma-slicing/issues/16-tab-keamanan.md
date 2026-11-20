# 16: Tab Keamanan: ganti kata sandi (✂️ bisa dipotong)

**Konteks (baca dulu):**
- Spec: `.scratch/lumen-figma-slicing/spec.md`
- Peta frame dan penyimpangan dari Figma: `.scratch/lumen-figma-slicing/figma-frames.md` (bagian frame terkait)
- Figma (file key `cEhdAQvduiD4OwOHK5UQdh`):
  - `166:1229`: https://www.figma.com/design/cEhdAQvduiD4OwOHK5UQdh/LUMEN-GCJ-2026--Copy-?node-id=166-1229
  - `166:1031`: https://www.figma.com/design/cEhdAQvduiD4OwOHK5UQdh/LUMEN-GCJ-2026--Copy-?node-id=166-1031
- Aturan repo: `CLAUDE.md` (tanpa `git commit`/`git push`, token design system, aksesibilitas)

**What to build:** Di tab Keamanan pada Profil, pengguna mengganti kata sandi dengan syarat yang sama seperti saat mendaftar.

**Blocked by:** 03, 14

**Status:** ready-for-agent

- [ ] Form kata sandi baru dan konfirmasi, dengan checklist dari modul aturan kata sandi
- [ ] Simpan memanggil `updateUser({ password })`; sukses dan gagal ditampilkan lewat toast
- [ ] Tidak ditampilkan untuk tamu (tamu diarahkan ke upgrade akun)
- [ ] Build, lint, dan tes lulus
