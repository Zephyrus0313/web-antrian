let currentNumber = parseInt(localStorage.getItem("currentNumber")) || 0;
let pesananList = JSON.parse(localStorage.getItem("pesananList")) || [];

function formatTime(date) {
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

// ==================== PELANGGAN ====================
const form = document.getElementById("form-pesanan");
if (form) {
  form.addEventListener("submit", function(e) {
    e.preventDefault();
    const menuDipilih = Array.from(document.querySelectorAll('input[name="menu"]:checked')).map(el => el.value);
    if (menuDipilih.length === 0) {
      alert("Silakan pilih minimal 1 menu.");
      return;
    }

    currentNumber++;
    localStorage.setItem("currentNumber", currentNumber);

    const waktu = new Date();
    pesananList.push({
      nomor: currentNumber,
      menu: menuDipilih,
      status: "Menunggu",
      jam: formatTime(waktu)
    });

    localStorage.setItem("pesananList", JSON.stringify(pesananList));
    form.reset();
    window.location.href = "pesanan.html"; // redirect ke halaman lihat pesanan
  });
}

// ==================== PENJUAL ====================
const daftarContainer = document.getElementById("daftar-pesanan");
if (daftarContainer) {
  renderDaftarPesanan();

  daftarContainer.addEventListener("change", function(e) {
    const index = e.target.dataset.index;
    if (e.target.classList.contains("select-status")) {
      pesananList[index].status = e.target.value;
      simpanData();
      renderDaftarPesanan(); // opsional: bisa diganti jadi hanya update teks
    }
  });

  daftarContainer.addEventListener("click", function(e) {
    const index = e.target.dataset.index;
    if (e.target.classList.contains("btn-hapus")) {
      if (confirm("Hapus pesanan ini?")) {
        pesananList.splice(index, 1);
        simpanData();
        renderDaftarPesanan();
      }
    }
  });
}

function renderDaftarPesanan() {
  if (pesananList.length === 0) {
    daftarContainer.innerHTML = "<p>Belum ada pesanan.</p>";
  } else {
    daftarContainer.innerHTML = pesananList.map((p, i) => `
      <div style="margin-bottom:20px; border-bottom:1px solid #ccc; padding-bottom:10px;">
        <p><strong>Antrian #${p.nomor}</strong> - <em>${p.jam}</em></p>
        <ul>${p.menu.map(item => `<li>${item}</li>`).join("")}</ul>
        <label>Status: 
          <select class="select-status" data-index="${i}">
            <option value="Menunggu" ${p.status === "Menunggu" ? "selected" : ""}>Menunggu</option>
            <option value="Sedang dibuat" ${p.status === "Sedang dibuat" ? "selected" : ""}>Sedang dibuat</option>
            <option value="Selesai" ${p.status === "Selesai" ? "selected" : ""}>Selesai</option>
          </select>
        </label>
        <br><button class="btn-hapus" data-index="${i}">Hapus</button>
      </div>
    `).join("");
  }
}

function simpanData() {
  localStorage.setItem("pesananList", JSON.stringify(pesananList));
}
