// Ganti dengan konfigurasi Firebase kamu
const firebaseConfig = {
    apiKey: "API_KEY_KAMU",
    authDomain: "PROJECT_ID.firebaseapp.com",
    databaseURL: "https://PROJECT_ID-default-rtdb.firebaseio.com",
    projectId: "PROJECT_ID",
    storageBucket: "PROJECT_ID.appspot.com",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID"
  };
  
  firebase.initializeApp(firebaseConfig);
  const db = firebase.database();
  
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
    form.addEventListener("submit", async function(e) {
      e.preventDefault();
      const menuDipilih = Array.from(document.querySelectorAll('input[name="menu"]:checked')).map(el => el.value);
      if (menuDipilih.length === 0) {
        alert("Silakan pilih minimal 1 menu.");
        return;
      }
  
      const snapshot = await db.ref("pesanan").once("value");
      const count = snapshot.numChildren();
  
      const dataPesanan = {
        nomor: count + 1,
        menu: menuDipilih,
        status: "Menunggu",
        jam: formatTime(new Date())
      };
  
      await db.ref("pesanan").push(dataPesanan);
      localStorage.setItem("pesananTerakhir", JSON.stringify(dataPesanan));
      form.reset();
      window.location.href = "pesanan.html";
    });
  }
  
  // ==================== PENJUAL ====================
  const daftarContainer = document.getElementById("daftar-pesanan");
  if (daftarContainer) {
    db.ref("pesanan").on("value", (snapshot) => {
      const data = snapshot.val();
      daftarContainer.innerHTML = "";
  
      if (!data) {
        daftarContainer.innerHTML = "<p>Belum ada pesanan.</p>";
        return;
      }
  
      Object.entries(data).forEach(([id, p], i) => {
        const div = document.createElement("div");
        div.style.marginBottom = "20px";
        div.style.borderBottom = "1px solid #ccc";
        div.style.paddingBottom = "10px";
  
        div.innerHTML = `
          <p><strong>Antrian #${p.nomor}</strong> - <em>${p.jam}</em></p>
          <ul>${p.menu.map(item => `<li>${item}</li>`).join("")}</ul>
          <label>Status:
            <select class="select-status" data-id="${id}">
              <option value="Menunggu" ${p.status === "Menunggu" ? "selected" : ""}>Menunggu</option>
              <option value="Sedang dibuat" ${p.status === "Sedang dibuat" ? "selected" : ""}>Sedang dibuat</option>
              <option value="Selesai" ${p.status === "Selesai" ? "selected" : ""}>Selesai</option>
            </select>
          </label><br>
          <button class="btn-hapus" data-id="${id}">Hapus</button>
        `;
        daftarContainer.appendChild(div);
      });
    });
  
    daftarContainer.addEventListener("change", function(e) {
      if (e.target.classList.contains("select-status")) {
        const id = e.target.dataset.id;
        const status = e.target.value;
        db.ref(`pesanan/${id}`).update({ status });
      }
    });
  
    daftarContainer.addEventListener("click", function(e) {
      if (e.target.classList.contains("btn-hapus")) {
        const id = e.target.dataset.id;
        if (confirm("Hapus pesanan ini?")) {
          db.ref(`pesanan/${id}`).remove();
        }
      }
    });
  }
  
  // ==================== PESANAN PRIBADI ====================
  const detailContainer = document.getElementById("detail-pesanan");
  if (detailContainer) {
    const pesananTerakhir = JSON.parse(localStorage.getItem("pesananTerakhir") || "null");
  
    if (pesananTerakhir) {
      detailContainer.innerHTML = `
        <p>Nomor Antrian: <strong>${pesananTerakhir.nomor}</strong></p>
        <p>Waktu Pesan: ${pesananTerakhir.jam}</p>
        <p>Status: <strong>${pesananTerakhir.status}</strong></p>
        <ul>${pesananTerakhir.menu.map(m => `<li>${m}</li>`).join("")}</ul>
      `;
    } else {
      detailContainer.innerHTML = `<p>Tidak ada pesanan ditemukan.</p>`;
    }
  }
  
