const menuCariHareketListesiUi = () => {
  $("#app-screen").html("");
  $("#app-screen").append(`<div class="cari-hareket-listesi-screen">
        <h1 class="text-center">Cari Hareket Listesi</h1>
        <div class="filter-container d-flex my-3">
          <div class="row align-items-center w-100">
            <div class="col-3">
              <label for="cari-hareket-listesi-filter-kod">Cari Kod:</label>
              <select name="cari-hareket-listesi-filter-kod" id="cari-hareket-listesi-filter-kod">
                <option value=""></option>
              </select>
            </div>
            <div class="col-4">
              <label for="cari-hareket-listesi-filter-baslangic-tarihi">Başlangıç Tarihi:</label>
              <input type="text" id="cari-hareket-listesi-filter-baslangic-tarihi" name="cari-hareket-listesi-filter-baslangic-tarihi" value="" />
            </div>
            <div class="col-4">
              <label for="cari-hareket-listesi-filter-bitis-tarihi">Bitiş Tarihi:</label>
              <input type="text" id="cari-hareket-listesi-filter-bitis-tarihi" name="cari-hareket-listesi-filter-bitis-tarihi" value="" />
            </div>
            <div class="col-1">
              <button class="btn btn-primary ms-2" id="cari-hareket-listesi-filter-btn" onclick="cariHareketListesiFiltre()">Filtrele</button>
            </div>
          </div>
        </div>
        <div class="cari-hareket-listesi-table-screen">
          <table class="table table-hover">
            <thead>
              <tr>
                <th scope="col">Hareket Kodu</th>
                <th scope="col">Cari Kod</th>
                <th scope="col">Ticari Ünvan</th>
                <th scope="col">Tarih</th>
                <th scope="col">İşlem Türü</th>
                <th scope="col">Fatura No</th>
                <th scope="col">Makbuz No</th>
                <th scope="col">Hareket Tipi</th>
                <th scope="col">Borç</th>
                <th scope="col">Alacak</th>
              </tr>
            </thead>
            <tbody class="cari-hareket-listesi-table-body"></tbody>
          </table>
        </div>
      </div>`);
  cariTanim.map((item) => $("#cari-hareket-listesi-filter-kod").append(`<option value="${item.kod}">${item.ticariUnvan}</option>`));
  $("#cari-hareket-listesi-filter-baslangic-tarihi").datepicker({ dateFormat: "dd/mm/yy" });
  $("#cari-hareket-listesi-filter-bitis-tarihi").datepicker({ dateFormat: "dd/mm/yy" });
  cariHareketListesiTableFill(cariHareket);
};

$("#menu-cari-hareket-listesi-btn").on("click", menuCariHareketListesiUi);

const cariHareketListesiFiltre = () => {
  let cariKod;
  let baslangicTarihi;
  let bitisTarihi;
  let filteredHareket;
  if ($("#cari-hareket-listesi-filter-kod").val() !== "") {
    cariKod = $("#cari-hareket-listesi-filter-kod").val();
    filteredHareket = cariHareket.filter((item) => item.cariKod === cariKod);
  } else {
    filteredHareket = cariHareket;
  }
  if ($("#cari-hareket-listesi-filter-baslangic-tarihi").val() && $("#cari-hareket-listesi-filter-bitis-tarihi").val()) {
    baslangicTarihi = new Date($("#cari-hareket-listesi-filter-baslangic-tarihi").datepicker("getDate").getTime()).toJSON();
    bitisTarihi = new Date($("#cari-hareket-listesi-filter-bitis-tarihi").datepicker("getDate").getTime());
    bitisTarihi.setDate(bitisTarihi.getDate() + 1);
    bitisTarihi = bitisTarihi.toJSON().replace("21:00:00.000Z", "20:59:59.000Z");
    filteredHareket = filteredHareket.filter((item) => new Date(item.tarih).getTime() >= new Date(baslangicTarihi).getTime() && new Date(item.tarih).getTime() < new Date(bitisTarihi).getTime());
  }
  filteredHareket.sort((a, b) => (new Date(a.tarih).getTime() > new Date(b.tarih).getTime() ? 1 : -1));

  cariHareketListesiTableFill(filteredHareket);
};

const cariHareketListesiTableFill = (source) => {
  $(".cari-hareket-listesi-table-body").html("");
  source.map((item) =>
    $(".cari-hareket-listesi-table-body").append(`<tr>
                  <td>${item.no}</td>
                  <td>${item.cariKod}</td>
                  <td>${getData(item.cariKod, "kod", cariTanim).ticariUnvan}</td>
                  <td>${dateFormatter.format(new Date(item.tarih))}</td>
                  <td>${item.islemTuru}</td>
                  <td>${item.faturaNo}</td>
                  <td>${item.makbuzNo}</td>
                  <td>${item.hareketTipi}</td>
                  <td>${currencyFormatter.format(item.borc)}</td>
                  <td>${currencyFormatter.format(item.alacak)}</td>
                </tr>`)
  );
};
