const menuKasaHareketListesiUi = () => {
  $("#app-screen").html("");
  $("#app-screen").append(`<div class="kasa-hareket-listesi-screen">
        <h1 class="text-center">Kasa Hareket Listesi</h1>
        <div class="filter-container d-flex my-3">
          <div class="row align-items-center w-100">
            <div class="col-3">
              <label for="kasa-hareket-listesi-filter-kod">Kasa Kodu:</label>
              <select name="kasa-hareket-listesi-filter-kod" id="kasa-hareket-listesi-filter-kod">
                <option value=""></option>
              </select>
            </div>
            <div class="col-4">
              <label for="kasa-hareket-listesi-filter-baslangic-tarihi">Başlangıç Tarihi:</label>
              <input type="text" id="kasa-hareket-listesi-filter-baslangic-tarihi" name="kasa-hareket-listesi-filter-baslangic-tarihi" value="" />
            </div>
            <div class="col-4">
              <label for="kasa-hareket-listesi-filter-bitis-tarihi">Bitiş Tarihi:</label>
              <input type="text" id="kasa-hareket-listesi-filter-bitis-tarihi" name="kasa-hareket-listesi-filter-bitis-tarihi" value="" />
            </div>
            <div class="col-1">
              <button class="btn btn-primary ms-2" id="kasa-hareket-listesi-filter-btn" onclick="kasaHareketListesiFiltre()">Filtrele</button>
            </div>
          </div>
        </div>
        <div class="kasa-hareket-listesi-table-screen">
          <table class="table table-hover">
            <thead>
              <tr>
                <th scope="col">Hareket Kodu</th>
                <th scope="col">Kasa Kodu</th>
                <th scope="col">Kasa Adı</th>
                <th scope="col">Makbuz No</th>
                <th scope="col">Hareket Tipi</th>
                <th scope="col">Tarih</th>
                <th scope="col">Gelir</th>
                <th scope="col">Gider</th>
                <th scope="col">İşlem Türü</th>
              </tr>
            </thead>
            <tbody class="kasa-hareket-listesi-table-body"></tbody>
          </table>
        </div>
      </div>`);
  kasaTanim.map((item) => $("#kasa-hareket-listesi-filter-kod").append(`<option value="${item.kod}">${item.ad}</option>`));
  $("#kasa-hareket-listesi-filter-baslangic-tarihi").datepicker({ dateFormat: "dd/mm/yy" });
  $("#kasa-hareket-listesi-filter-bitis-tarihi").datepicker({ dateFormat: "dd/mm/yy" });
  kasaHareketListesiTableFill(kasaHareket);
};

$("#menu-kasa-hareket-listesi-btn").on("click", menuKasaHareketListesiUi);

const kasaHareketListesiFiltre = () => {
  let kasaKodu;
  let baslangicTarihi;
  let bitisTarihi;
  let filteredHareket;
  if ($("#kasa-hareket-listesi-filter-kod").val() !== "") {
    kasaKodu = $("#kasa-hareket-listesi-filter-kod").val();
    filteredHareket = kasaHareket.filter((item) => item.kasaKodu === kasaKodu);
  } else {
    filteredHareket = kasaHareket;
  }
  if ($("#kasa-hareket-listesi-filter-baslangic-tarihi").val() && $("#kasa-hareket-listesi-filter-bitis-tarihi").val()) {
    baslangicTarihi = new Date($("#kasa-hareket-listesi-filter-baslangic-tarihi").datepicker("getDate").getTime()).toJSON();
    bitisTarihi = new Date($("#kasa-hareket-listesi-filter-bitis-tarihi").datepicker("getDate").getTime());
    bitisTarihi.setDate(bitisTarihi.getDate() + 1);
    bitisTarihi = bitisTarihi.toJSON().replace("21:00:00.000Z", "20:59:59.000Z");
    filteredHareket = filteredHareket.filter((item) => new Date(item.tarih).getTime() > new Date(baslangicTarihi).getTime() && new Date(item.tarih).getTime() < new Date(bitisTarihi).getTime());
  }
  filteredHareket.sort((a, b) => (new Date(a.tarih).getTime() > new Date(b.tarih).getTime() ? 1 : -1));

  kasaHareketListesiTableFill(filteredHareket);
};

const kasaHareketListesiTableFill = (source) => {
  $(".kasa-hareket-listesi-table-body").html("");
  source.map((item) =>
    $(".kasa-hareket-listesi-table-body").append(`<tr>
                  <td>${item.no}</td>
                  <td>${item.kasaKodu}</td>
                  <td>${getData(item.kasaKodu, "kod", kasaTanim).ad}</td>
                  <td>${item.makbuzNo}</td>
                  <td>${item.hareketTipi}</td>
                  <td>${dateFormatter.format(new Date(item.tarih))}</td>
                  <td>${currencyFormatter.format(item.gelir)}</td>
                  <td>${currencyFormatter.format(item.gider)}</td>
                  <td>${item.islemTuru}</td>
                </tr>`)
  );
};
