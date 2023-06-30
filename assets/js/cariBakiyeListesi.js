const menuCariBakiyeListesiUi = () => {
  $("#app-screen").html("");
  $("#app-screen").append(`<div class="cari-bakiye-listesi-screen">
        <h1 class="text-center">Cari Bakiye Listesi</h1>
        <div class="filter-container d-flex my-3">
          <div class="row align-items-center w-100">
            <div class="col-4">
              <label for="cari-bakiye-listesi-filter-baslangic-tarihi">Başlangıç Tarihi:</label>
              <input type="text" id="cari-bakiye-listesi-filter-baslangic-tarihi" name="cari-bakiye-listesi-filter-baslangic-tarihi" value="" />
            </div>
            <div class="col-4">
              <label for="cari-bakiye-listesi-filter-bitis-tarihi">Bitiş Tarihi:</label>
              <input type="text" id="cari-bakiye-listesi-filter-bitis-tarihi" name="cari-bakiye-listesi-filter-bitis-tarihi" value="" />
            </div>
            <div class="col-1">
              <button class="btn btn-primary ms-2" id="cari-bakiye-listesi-filter-btn" onclick="cariBakiyeListesiFiltre()">Filtrele</button>
            </div>
          </div>
        </div>
        <div class="cari-bakiye-listesi-table-screen">
          <table class="table table-hover">
            <thead>
              <tr>
                <th scope="col">Cari Kod</th>
                <th scope="col">Ticari Ünvan</th>
                <th scope="col">Alacak Toplam</th>
                <th scope="col">Borç Toplam</th>
                <th scope="col">Alacak Bakiyesi</th>
                <th scope="col">Borç Bakiyesi</th>
                <th scope="col">Devreden Alacak Bakiyesi</th>
                <th scope="col">Devreden Borç Bakiyesi</th>
                <th scope="col">Toplam Alacak Bakiyesi</th>
                <th scope="col">Toplam Borç Bakiyesi</th>
              </tr>
            </thead>
            <tbody class="cari-bakiye-listesi-table-body"></tbody>
          </table>
        </div>
      </div>`);
  $("#cari-bakiye-listesi-filter-baslangic-tarihi").datepicker({ dateFormat: "dd/mm/yy" });
  $("#cari-bakiye-listesi-filter-bitis-tarihi").datepicker({ dateFormat: "dd/mm/yy" });
};

$("#menu-cari-bakiye-listesi-btn").on("click", menuCariBakiyeListesiUi);

const cariBakiyeListesiFiltre = () => {
  let baslangicTarihi;
  let bitisTarihi;
  if ($("#cari-bakiye-listesi-filter-baslangic-tarihi").val() && $("#cari-bakiye-listesi-filter-bitis-tarihi").val()) {
    baslangicTarihi = new Date($("#cari-bakiye-listesi-filter-baslangic-tarihi").datepicker("getDate").getTime()).toJSON();
    bitisTarihi = new Date($("#cari-bakiye-listesi-filter-bitis-tarihi").datepicker("getDate").getTime());
    bitisTarihi.setDate(bitisTarihi.getDate() + 1);
    bitisTarihi = bitisTarihi.toJSON().replace("21:00:00.000Z", "20:59:59.000Z");
  }

  let dateFilteredCariHareket = cariHareket.filter((item) => new Date(item.tarih).getTime() >= new Date(baslangicTarihi).getTime() && new Date(item.tarih).getTime() < new Date(bitisTarihi).getTime());
  let devredenCariHareket = cariHareket.filter((item) => new Date(item.tarih).getTime() < new Date(baslangicTarihi).getTime());

  let dateFilteredCariHareketByCari = cariTanim.map((item) => {
    let values = dateFilteredCariHareket.filter((x) => x.cariKod === item.kod);
    if (values.length === 0) {
      values.push({ cariKod: item.kod });
    }
    return values;
  });

  let devredenCariHareketByCari = cariTanim.map((item) => {
    let values = devredenCariHareket.filter((x) => x.cariKod === item.kod);
    if (values.length === 0) {
      values.push({ cariKod: item.kod });
    }
    return values;
  });

  let filteredTableValues = dateFilteredCariHareketByCari.map((item) => {
    let cariKod = item[0].cariKod;
    let ticariUnvan = getData(cariKod, "kod", cariTanim).ticariUnvan;
    let alacakToplam = Object.hasOwn(item[0], "alacak") ? item.reduce((acc, obj) => acc + obj.alacak, 0) : 0;
    let borcToplam = Object.hasOwn(item[0], "borc") ? item.reduce((acc, obj) => acc + obj.borc, 0) : 0;
    let alacakBakiyesi = alacakToplam > borcToplam ? alacakToplam - borcToplam : 0;
    let borcBakiyesi = alacakToplam < borcToplam ? borcToplam - alacakToplam : 0;
    return {
      cariKod: cariKod,
      ticariUnvan: ticariUnvan,
      alacakToplam: alacakToplam,
      borcToplam: borcToplam,
      alacakBakiyesi: alacakBakiyesi,
      borcBakiyesi: borcBakiyesi,
      devredenAlacakBakiyesi: "",
      devredenBorcBakiyesi: "",
      toplamAlacakBakiyesi: "",
      toplamBorcBakiyesi: "",
    };
  });

  let devredenTableValues = devredenCariHareketByCari.map((item) => {
    return {
      cariKod: item[0].cariKod,
      alacak: item.reduce((acc, obj) => acc + obj.alacak, 0),
      borc: item.reduce((acc, obj) => acc + obj.borc, 0),
    };
  });

  filteredTableValues.forEach((item) => {
    let elementIndex = devredenTableValues.findIndex((x) => x.cariKod === item.cariKod);
    item.devredenAlacakBakiyesi = !isNaN(devredenTableValues[elementIndex].alacak) ? devredenTableValues[elementIndex].alacak : 0;
    item.devredenBorcBakiyesi = !isNaN(devredenTableValues[elementIndex].borc) ? devredenTableValues[elementIndex].borc : 0;
    item.toplamAlacakBakiyesi =
      item.alacakBakiyesi + item.devredenAlacakBakiyesi > item.borcBakiyesi + item.devredenBorcBakiyesi
        ? item.alacakBakiyesi + item.devredenAlacakBakiyesi - (item.borcBakiyesi + item.devredenBorcBakiyesi)
        : 0;
    item.toplamBorcBakiyesi =
      item.alacakBakiyesi + item.devredenAlacakBakiyesi < item.borcBakiyesi + item.devredenBorcBakiyesi
        ? item.borcBakiyesi + item.devredenBorcBakiyesi - (item.alacakBakiyesi + item.devredenAlacakBakiyesi)
        : 0;
  });

  cariBakiyeListesiTableFill(filteredTableValues);
};

const cariBakiyeListesiTableFill = (source) => {
  $(".cari-bakiye-listesi-table-body").html("");
  source.map((item) =>
    $(".cari-bakiye-listesi-table-body").append(`<tr>
                <td>${item.cariKod}</td>
                <td>${item.ticariUnvan}</td>
                <td>${item.alacakToplam}</td>
                <td>${item.borcToplam}</td>
                <td>${item.alacakBakiyesi}</td>
                <td>${item.borcBakiyesi}</td>
                <td>${item.devredenAlacakBakiyesi}</td>
                <td>${item.devredenBorcBakiyesi}</td>
                <td>${item.toplamAlacakBakiyesi}</td>
                <td>${item.toplamBorcBakiyesi}</td>
                </tr>`)
  );
};
