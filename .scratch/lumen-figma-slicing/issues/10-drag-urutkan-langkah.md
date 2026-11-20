# 10: Drag untuk mengurutkan langkah (✂️ bisa dipotong)

**Konteks (baca dulu):**
- Spec: `.scratch/lumen-figma-slicing/spec.md`
- Peta frame dan penyimpangan dari Figma: `.scratch/lumen-figma-slicing/figma-frames.md` (bagian frame terkait)
- Figma (file key `cEhdAQvduiD4OwOHK5UQdh`):
  - `167:1622`: https://www.figma.com/design/cEhdAQvduiD4OwOHK5UQdh/LUMEN-GCJ-2026--Copy-?node-id=167-1622
- Aturan repo: `CLAUDE.md` (tanpa `git commit`/`git push`, token design system, aksesibilitas)

**What to build:** Di desktop, pengguna bisa menyeret langkah di dialog Tambah Tugas untuk mengubah urutan ("Seret untuk mengubah urutan").

**Blocked by:** 09

**Status:** ready-for-agent

- [ ] Drag-and-drop HTML5 native, tanpa dependency baru
- [ ] Tombol naik/turun tetap ada sebagai alternatif keyboard dan layar sentuh
- [ ] Urutan hasil drag tersimpan ke `position`
- [ ] Build, lint, dan tes lulus
