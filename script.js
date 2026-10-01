/* ===== PENGATURAN LOGIN GMAIL =====
   Isi dengan Client ID dari Google Cloud Console (cara dapatnya ada di penjelasan).
   Contoh: "1234567890-abcdefg.apps.googleusercontent.com"
   Kalau dikosongkan, halaman masuk memakai mode uji coba (email belum diverifikasi Google).
*/
const GOOGLE_CLIENT_ID = "";

/* ===== DAFTAR FILM =====
   Cara paling praktis (tanpa download): pakai link YouTube.
   1. Salin satu blok { ... } di bawah, lalu ganti isinya.
   2. Isi youtube: dengan link videonya, contoh "https://www.youtube.com/watch?v=XXXXXXXXXXX"
      (tidak perlu isi src). Gambar poster otomatis diambil dari YouTube.
   Cara lain (file sendiri): isi src: "film1.mp4" dan taruh filmnya di folder yang sama.

   genre harus salah satu dari daftarGenre di bawah.
   poster (opsional): gambar tegak untuk kartu, misal "poster1.jpg".
   latar (opsional): gambar lebar untuk banner besar. Kalau tidak ada, dipakai poster.
   unggulan: true  -> film ini tampil di banner besar paling atas.
*/
const films = [
  {
    judul: "Sintel",
    genre: "Aksi",
    tahun: "2010",
    youtube: "https://www.youtube.com/watch?v=eRsGyueVLvQ",
    unggulan: true,
    deskripsi: "Seorang gadis menjinakkan naga kecil. Setelah naga itu hilang, ia menempuh perjalanan jauh untuk mengambilnya kembali."
  },
  {
    judul: "Tears of Steel",
    genre: "Aksi",
    tahun: "2012",
    youtube: "https://www.youtube.com/watch?v=R6MlUcmOul8",
    deskripsi: "Sekelompok pejuang dan ilmuwan di Amsterdam berusaha menyelamatkan dunia dari robot perusak. Film fiksi ilmiah 12 menit."
  },
  {
    judul: "Agent 327: Operation Barbershop",
    genre: "Aksi",
    tahun: "2017",
    youtube: "https://www.youtube.com/watch?v=9IYRC7g2ICg",
    deskripsi: "Cuplikan animasi 3 menit tentang agen rahasia dari komik Belanda klasik. Ini film pendek, bukan film panjang."
  },
  {
    judul: "Cosmos Laundromat",
    genre: "Komedi",
    tahun: "2015",
    youtube: "https://www.youtube.com/watch?v=Y-rmzh0PI3c",
    deskripsi: "Kisah animasi 10 menit yang lucu dan absurd. Cocok untuk penonton usia 13 tahun ke atas."
  },
  {
    judul: "Big Buck Bunny",
    genre: "Animasi",
    tahun: "2008",
    youtube: "https://www.youtube.com/watch?v=YE7VzlLtp-4",
    deskripsi: "Kelinci besar yang tenang jadi marah ketika tiga hewan pengerat nakal merusak harinya, lalu ia membalas."
  },
  {
    judul: "Elephants Dream",
    genre: "Animasi",
    tahun: "2006",
    youtube: "https://www.youtube.com/watch?v=4eJVGqJhp40",
    deskripsi: "Film pendek animasi dari Blender Foundation, dibuat memakai software gratis Blender."
  },
  {
    judul: "Night of the Living Dead",
    genre: "Horor",
    tahun: "1968",
    youtube: "https://www.youtube.com/watch?v=rJ8DsFLWlbM",
    deskripsi: "Sekelompok orang bertahan di sebuah rumah pertanian saat mayat hidup mengepung mereka. Film zombie klasik berdurasi sekitar 1,5 jam."
  },
  {
    judul: "Sanam Teri Kasam",
    genre: "Romantis",
    tahun: "2016",
    youtube: "https://youtu.be/a37lqCtNvbw?si=u5Gfg_4JrYTDP2im",
    deskripsi: "Kisah cinta tragis dan pengorbanan antara seorang pustakawan kaku bernama Saraswati (Saru) dan seorang mantan narapidana bernama Inder Parihar."
  },
   {
    judul: "MY BOSSY GIRL",
    genre: "Drama",
    tahun: "2020 ",
    youtube: "https://youtu.be/BMQLxSt9838?si=-VIK1BELfeOba-gj",
    deskripsi: "Film ini mengajarkan agar kita bisa fight dgn trauma kita. Dan menjadi pemenang utk diri kita"
  }
  // contoh menambah film (hapus tanda // untuk mengaktifkan, lalu ganti isinya):
  // , { judul: "Judul Film", genre: "Drama", tahun: "2024", youtube: "https://www.youtube.com/watch?v=XXXXXXXXXXX", deskripsi: "Sinopsis film." }
  // contoh film dari file sendiri:
  // , { judul: "Film Lokal", genre: "Drama", tahun: "2022", src: "film2.mp4", poster: "poster2.jpg", deskripsi: "Sinopsis film." }
];

/* ===== BANTUAN YOUTUBE ===== */
function ambilIdYoutube(teks) {
  const m = String(teks).match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : String(teks).trim();
}
const thumbYoutube = (t) => "https://i.ytimg.com/vi/" + ambilIdYoutube(t) + "/maxresdefault.jpg";
const idFilm = (f) => (f.youtube ? "yt:" + ambilIdYoutube(f.youtube) : f.src);
function jagaGambar(img, wadah) {
  // urutan cadangan kalau gambar YouTube tidak tersedia
  const urut = ["maxresdefault", "mqdefault", "hqdefault"];
  const gagal = () => {
    const m = img.src.match(/\/(maxresdefault|mqdefault|hqdefault)\.jpg/);
    if (m) {
      const i = urut.indexOf(m[1]);
      if (i < urut.length - 1) { img.src = img.src.replace(m[1], urut[i + 1]); return; }
    }
    img.remove();
    if (wadah) wadah.classList.add("kosong");
  };
  img.addEventListener("error", gagal);
  // YouTube kadang mengirim gambar abu-abu kecil kalau gambar aslinya tidak ada
  img.addEventListener("load", () => { if (img.naturalWidth && img.naturalWidth <= 120) gagal(); });
}

const daftarGenre = ["Semua", "Aksi", "Drama", "Komedi", "Horor", "Animasi", "Romantis", "Favorit"];

/* ===== ELEMEN ===== */
const $ = (id) => document.getElementById(id);
const auth = $("auth"), app = $("app"), pesan = $("pesan");
const formDemo = $("formDemo"), gBtn = $("gBtn");
const avatar = $("avatar"), namaUser = $("namaUser"), tip = $("tip");
const cari = $("cari"), chips = $("chips"), grid = $("grid"), count = $("count");
const empty = $("empty"), emptyJudul = $("emptyJudul"), emptyIsi = $("emptyIsi");
const heroBg = $("heroBg"), heroMeta = $("heroMeta"), heroJudul = $("heroJudul"), heroDesk = $("heroDesk");
const heroTonton = $("heroTonton"), heroFav = $("heroFav");
const bioskop = $("bioskop"), player = $("player"), ytPlayer = $("ytPlayer"), tutup = $("tutup");
const mMeta = $("mMeta"), mJudul = $("mJudul"), mDesk = $("mDesk"), mFav = $("mFav");

/* ===== PENYIMPANAN (di browser) ===== */
const K_SESI = "filmku_session", K_TIP = "filmku_tip";
function baca(kunci, awal) {
  try { return JSON.parse(localStorage.getItem(kunci)) || awal; } catch (e) { return awal; }
}
function simpan(kunci, nilai) {
  try { localStorage.setItem(kunci, JSON.stringify(nilai)); } catch (e) {}
}

/* ===== MASUK DENGAN GMAIL ===== */
function tampilPesan(teks) { pesan.textContent = teks; }

function dekodeToken(token) {
  const b64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
  const json = decodeURIComponent(atob(b64).split("").map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join(""));
  return JSON.parse(json);
}

function setelahGoogle(respon) {
  try {
    const data = dekodeToken(respon.credential);
    masukDenganAkun({ email: data.email, nama: data.name || data.email.split("@")[0], foto: data.picture || "" });
  } catch (e) {
    tampilPesan("Gagal masuk dengan Google. Coba lagi.");
  }
}

function siapkanGoogle() {
  if (!window.google || !google.accounts) return;
  google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: setelahGoogle });
  google.accounts.id.renderButton(gBtn, { theme: "filled_black", size: "large", shape: "pill", text: "signin_with", locale: "id", width: 280 });
}

if (GOOGLE_CLIENT_ID) {
  window.onGoogleLibraryLoad = siapkanGoogle;
  siapkanGoogle();
} else {
  gBtn.hidden = true;
  formDemo.hidden = false;
}

formDemo.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = $("demoEmail").value.trim().toLowerCase();
  if (!/^[^\s@]+@gmail\.com$/.test(email)) return tampilPesan("Isi dengan alamat Gmail yang benar, contoh: nama@gmail.com");
  formDemo.reset();
  masukDenganAkun({ email: email, nama: email.split("@")[0], foto: "" });
});

function masukDenganAkun(akun) {
  simpan(K_SESI, akun);
  bukaApp(akun);
}

$("keluar").addEventListener("click", () => {
  tutupBioskop();
  localStorage.removeItem(K_SESI);
  if (window.google && google.accounts) google.accounts.id.disableAutoSelect();
  app.hidden = true;
  auth.hidden = false;
  tampilPesan("");
  window.scrollTo(0, 0);
});

/* ===== FAVORIT ===== */
let akunAktif = null;
let favorit = [];
const kunciFav = () => "filmku_fav_" + akunAktif.email;

function toggleFavorit(film) {
  if (!film) return;
  const i = favorit.indexOf(idFilm(film));
  if (i >= 0) favorit.splice(i, 1); else favorit.push(idFilm(film));
  simpan(kunciFav(), favorit);
  perbaruiFav();
  buatChips();
  tampilkan();
}

function setTombolFav(tombol, film) {
  const sudah = !!film && favorit.includes(idFilm(film));
  tombol.setAttribute("aria-pressed", sudah);
  tombol.textContent = sudah ? "Tersimpan di favorit" : "Simpan ke favorit";
}
function perbaruiFav() {
  setTombolFav(heroFav, unggulan());
  setTombolFav(mFav, filmAktif);
}

/* ===== BANNER FILM PILIHAN ===== */
let filmAktif = null;
const unggulan = () => films.find((f) => f.unggulan) || films[0] || null;

function buatHero() {
  const f = unggulan();
  heroBg.innerHTML = "";
  if (!f) {
    heroJudul.textContent = "Belum ada film";
    heroDesk.textContent = "Tambahkan film di script.js.";
    heroMeta.textContent = "";
    heroTonton.hidden = true;
    heroFav.hidden = true;
    return;
  }
  heroTonton.hidden = false;
  heroFav.hidden = false;
  heroMeta.textContent = f.genre + ", " + f.tahun;
  heroJudul.textContent = f.judul;
  heroDesk.textContent = f.deskripsi;
  const gambar = f.latar || f.poster || (f.youtube ? thumbYoutube(f.youtube) : "");
  if (gambar) {
    const img = document.createElement("img");
    img.src = gambar;
    img.alt = "";
    jagaGambar(img);
    heroBg.append(img);
  } else {
    const v = document.createElement("video");
    v.src = f.src + "#t=2";
    v.muted = true;
    v.preload = "metadata";
    v.playsInline = true;
    heroBg.append(v);
  }
}
heroTonton.addEventListener("click", () => bukaBioskop(unggulan(), heroTonton));
heroFav.addEventListener("click", () => toggleFavorit(unggulan()));

/* ===== DAFTAR FILM ===== */
let genre = "Semua";

function formatDurasi(detik) {
  if (!isFinite(detik)) return "";
  return Math.floor(detik / 60) + ":" + String(Math.floor(detik % 60)).padStart(2, "0");
}

function cocokGenre(f, nama) {
  if (nama === "Semua") return true;
  if (nama === "Favorit") return favorit.includes(idFilm(f));
  return f.genre === nama;
}

function buatChips() {
  chips.innerHTML = "";
  daftarGenre.forEach((nama) => {
    const jumlah = films.filter((f) => cocokGenre(f, nama)).length;
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.textContent = nama + " (" + jumlah + ")";
    b.setAttribute("aria-pressed", nama === genre);
    b.addEventListener("click", () => { genre = nama; buatChips(); tampilkan(); });
    chips.appendChild(b);
  });
}

function buatKartu(f) {
  const kartu = document.createElement("button");
  kartu.type = "button";
  kartu.className = "card";

  const thumb = document.createElement("div");
  thumb.className = "thumb";
  thumb.dataset.judul = f.judul;

  const durasi = document.createElement("span");
  durasi.className = "dur";
  if (!f.youtube) {
    const pv = document.createElement("video");
    pv.src = f.src + "#t=1";
    pv.muted = true;
    pv.playsInline = true;
    pv.preload = "metadata";
    pv.setAttribute("aria-hidden", "true");
    pv.addEventListener("loadedmetadata", () => { durasi.textContent = formatDurasi(pv.duration); });
    pv.addEventListener("error", () => { kartu.classList.add("rusak"); });
    thumb.append(pv);
  }

  const gambar = f.poster || (f.youtube ? thumbYoutube(f.youtube) : "");
  if (gambar) {
    const img = document.createElement("img");
    img.src = gambar;
    img.alt = "Poster " + f.judul;
    jagaGambar(img, thumb);
    thumb.append(img);
  }
  thumb.append(durasi);
  if (favorit.includes(idFilm(f))) {
    const t = document.createElement("span");
    t.className = "tag";
    t.textContent = "Favorit";
    thumb.append(t);
  }

  const h = document.createElement("h3");
  h.textContent = f.judul;
  const k = document.createElement("p");
  k.className = "kat";
  k.textContent = f.genre + ", " + f.tahun;
  kartu.append(thumb, h, k);
  kartu.addEventListener("click", () => bukaBioskop(f, kartu));
  return kartu;
}

function tampilkan() {
  const q = cari.value.trim().toLowerCase();
  const hasil = films.filter((f) => cocokGenre(f, genre) && f.judul.toLowerCase().includes(q));
  grid.innerHTML = "";
  hasil.forEach((f) => grid.appendChild(buatKartu(f)));
  empty.hidden = hasil.length > 0;
  if (!hasil.length) {
    if (genre === "Favorit" && !q) {
      emptyJudul.textContent = "Belum ada favorit";
      emptyIsi.textContent = "Buka sebuah film lalu tekan Simpan ke favorit.";
    } else {
      emptyJudul.textContent = "Film tidak ditemukan";
      emptyIsi.textContent = "Coba kata kunci lain atau pilih genre Semua.";
    }
  }
  count.textContent = hasil.length + " film";
}
cari.addEventListener("input", tampilkan);

/* ===== PEMUTAR FILM ===== */
let pembuka = null;

function bukaBioskop(f, asal) {
  if (!f) return;
  filmAktif = f;
  pembuka = asal || null;
  mMeta.textContent = f.genre + ", " + f.tahun;
  mJudul.textContent = f.judul;
  mDesk.textContent = f.deskripsi;
  if (f.youtube) {
    player.pause();
    player.hidden = true;
    ytPlayer.hidden = false;
    ytPlayer.src = "https://www.youtube-nocookie.com/embed/" + ambilIdYoutube(f.youtube) + "?autoplay=1&rel=0";
  } else {
    ytPlayer.hidden = true;
    ytPlayer.src = "about:blank";
    player.hidden = false;
    player.src = f.src;
  }
  perbaruiFav();
  bioskop.hidden = false;
  document.body.classList.add("kunci");
  document.title = f.judul + " | FilmKu";
  if (!f.youtube) player.play().catch(() => {});
  tutup.focus();
}

function tutupBioskop() {
  if (bioskop.hidden) return;
  player.pause();
  ytPlayer.src = "about:blank";
  bioskop.hidden = true;
  document.body.classList.remove("kunci");
  document.title = "FilmKu | Tonton film favoritmu";
  if (pembuka) pembuka.focus();
}
tutup.addEventListener("click", tutupBioskop);
bioskop.addEventListener("click", (e) => { if (e.target === bioskop) tutupBioskop(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") tutupBioskop(); });
mFav.addEventListener("click", () => toggleFavorit(filmAktif));

/* ===== TIP CARA PAKAI ===== */
$("tipTutup").addEventListener("click", () => { tip.hidden = true; simpan(K_TIP, true); });

/* ===== MULAI ===== */
function bukaApp(akun) {
  akunAktif = akun;
  favorit = baca(kunciFav(), []);
  namaUser.textContent = akun.nama;
  avatar.innerHTML = "";
  if (akun.foto) {
    const img = document.createElement("img");
    img.src = akun.foto;
    img.alt = "";
    img.referrerPolicy = "no-referrer";
    img.addEventListener("error", () => { avatar.textContent = akun.nama.charAt(0).toUpperCase(); });
    avatar.append(img);
  } else {
    avatar.textContent = akun.nama.charAt(0).toUpperCase();
  }
  auth.hidden = true;
  app.hidden = false;
  tip.hidden = !!baca(K_TIP, false);
  genre = "Semua";
  cari.value = "";
  filmAktif = null;
  buatHero();
  buatChips();
  tampilkan();
  perbaruiFav();
  window.scrollTo(0, 0);
}

const sesi = baca(K_SESI, null);
if (sesi && sesi.email) {
  bukaApp(sesi);
} else {
  auth.hidden = false;
}
