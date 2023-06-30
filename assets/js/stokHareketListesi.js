const menuStokHareketListesiUi = () => {
  $("#app-screen").html("");
  $("#app-screen").append(`<div class="stok-hareket-listesi-screen">
        <h1 class="text-center">Stok Hareket Listesi</h1>
        <div class="filter-container d-flex my-3">
          <div class="row align-items-center w-100">
            <div class="col-3">
              <label for="stok-hareket-listesi-filter-kod">Stok Kodu:</label>
              <select name="stok-hareket-listesi-filter-kod" id="stok-hareket-listesi-filter-kod">
                <option value=""></option>
              </select>
            </div>
            <div class="col-4">
              <label for="stok-hareket-listesi-filter-baslangic-tarihi">Başlangıç Tarihi:</label>
              <input type="text" id="stok-hareket-listesi-filter-baslangic-tarihi" name="stok-hareket-listesi-filter-baslangic-tarihi" value="" />
            </div>
            <div class="col-4">
              <label for="stok-hareket-listesi-filter-bitis-tarihi">Bitiş Tarihi:</label>
              <input type="text" id="stok-hareket-listesi-filter-bitis-tarihi" name="stok-hareket-listesi-filter-bitis-tarihi" value="" />
            </div>
            <div class="col-1">
              <button class="btn btn-primary ms-2" id="stok-hareket-listesi-filter-btn" onclick="stokHareketListesiFiltre()">Filtrele</button>
            </div>
          </div>
        </div>
        <div class="stok-hareket-listesi-table-screen">
          <table class="table table-hover">
            <thead>
              <tr>
                <th scope="col">Hareket Kodu</th>
                <th scope="col">Stok Kodu</th>
                <th scope="col">Stok Adı</th>
                <th scope="col">Fatura No</th>
                <th scope="col">Hareket Tipi</th>
                <th scope="col">Tarih</th>
                <th scope="col">Giren Miktar</th>
                <th scope="col">Çıkan Miktar</th>
                <th scope="col">Birim</th>
                <th scope="col">Giren Fiyat</th>
                <th scope="col">Çıkan Fiyat</th>
                <th scope="col">Giren Tutar</th>
                <th scope="col">Çıkan Tutar</th>
              </tr>
            </thead>
            <tbody class="stok-hareket-listesi-table-body"></tbody>
          </table>
        </div>
      </div>`);
  stokTanim.map((item) => $("#stok-hareket-listesi-filter-kod").append(`<option value="${item.kod}">${item.ad}</option>`));
  $("#stok-hareket-listesi-filter-baslangic-tarihi").datepicker({ dateFormat: "dd/mm/yy" });
  $("#stok-hareket-listesi-filter-bitis-tarihi").datepicker({ dateFormat: "dd/mm/yy" });
  stokHareketListesiTableFill(stokHareket);
};

$("#menu-stok-hareket-listesi-btn").on("click", menuStokHareketListesiUi);

const stokHareketListesiFiltre = () => {
  let stokKodu;
  let baslangicTarihi;
  let bitisTarihi;
  let filteredHareket;
  if ($("#stok-hareket-listesi-filter-kod").val() !== "") {
    stokKodu = $("#stok-hareket-listesi-filter-kod").val();
    filteredHareket = stokHareket.filter((item) => item.stokKodu === stokKodu);
  } else {
    filteredHareket = stokHareket;
  }
  if ($("#stok-hareket-listesi-filter-baslangic-tarihi").val() && $("#stok-hareket-listesi-filter-bitis-tarihi").val()) {
    baslangicTarihi = new Date($("#stok-hareket-listesi-filter-baslangic-tarihi").datepicker("getDate").getTime()).toJSON();
    bitisTarihi = new Date($("#stok-hareket-listesi-filter-bitis-tarihi").datepicker("getDate").getTime());
    bitisTarihi.setDate(bitisTarihi.getDate() + 1);
    bitisTarihi = bitisTarihi.toJSON().replace("21:00:00.000Z", "20:59:59.000Z");
    filteredHareket = filteredHareket.filter((item) => new Date(item.tarih).getTime() > new Date(baslangicTarihi).getTime() && new Date(item.tarih).getTime() < new Date(bitisTarihi).getTime());
  }
  filteredHareket.sort((a, b) => (new Date(a.tarih).getTime() > new Date(b.tarih).getTime() ? 1 : -1));

  stokHareketListesiTableFill(filteredHareket);
};

const stokHareketListesiTableFill = (source) => {
  $(".stok-hareket-listesi-table-body").html("");
  source.map((item) =>
    $(".stok-hareket-listesi-table-body").append(`<tr>
                  <td>${item.no}</td>
                  <td>${item.stokKodu}</td>
                  <td>${getData(item.stokKodu, "kod", stokTanim).ad}</td>
                  <td>${item.faturaNo}</td>
                  <td>${item.hareketTipi}</td>
                  <td>${dateFormatter.format(new Date(item.tarih))}</td>
                  <td>${item.girenMiktar}</td>
                  <td>${item.cikanMiktar}</td>
                  <td>${item.birim}</td>
                  <td>${currencyFormatter.format(item.girenFiyat)}</td>
                  <td>${currencyFormatter.format(item.cikanFiyat)}</td>
                  <td>${currencyFormatter.format(item.girenTutar)}</td>
                  <td>${currencyFormatter.format(item.cikanTutar)}</td>
                </tr>`)
  );
};
