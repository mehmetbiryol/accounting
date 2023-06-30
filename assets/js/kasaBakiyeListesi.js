const menuKasaBakiyeListesiUi = () => {
  $("#app-screen").html("");
  $("#app-screen").append(`<div class="kasa-bakiye-listesi-screen">
        <h1 class="text-center">Kasa Bakiye Listesi</h1>
        <div class="filter-container d-flex my-3">
          <div class="row align-items-center w-100">
            <div class="col-4">
              <label for="kasa-bakiye-listesi-filter-baslangic-tarihi">Başlangıç Tarihi:</label>
              <input type="text" id="kasa-bakiye-listesi-filter-baslangic-tarihi" name="kasa-bakiye-listesi-filter-baslangic-tarihi" value="" />
            </div>
            <div class="col-4">
              <label for="kasa-bakiye-listesi-filter-bitis-tarihi">Bitiş Tarihi:</label>
              <input type="text" id="kasa-bakiye-listesi-filter-bitis-tarihi" name="kasa-bakiye-listesi-filter-bitis-tarihi" value="" />
            </div>
            <div class="col-1">
              <button class="btn btn-primary ms-2" id="kasa-bakiye-listesi-filter-btn" onclick="kasaBakiyeListesiFiltre()">Filtrele</button>
            </div>
          </div>
        </div>
        <div class="kasa-bakiye-listesi-table-screen">
          <table class="table table-hover">
            <thead>
              <tr>
                <th scope="col">Kasa Kodu</th>
                <th scope="col">Kasa Adı</th>
                <th scope="col">Gelir Toplam</th>
                <th scope="col">Gider Toplam</th>
                <th scope="col">Gelir Bakiyesi</th>
                <th scope="col">Gider Bakiyesi</th>
                <th scope="col">Devreden Gelir Bakiyesi</th>
                <th scope="col">Devreden Gider Bakiyesi</th>
                <th scope="col">Toplam Gelir Bakiyesi</th>
                <th scope="col">Toplam Gider Bakiyesi</th>
              </tr>
            </thead>
            <tbody class="kasa-bakiye-listesi-table-body"></tbody>
          </table>
        </div>
      </div>`);
  $("#kasa-bakiye-listesi-filter-baslangic-tarihi").datepicker({ dateFormat: "dd/mm/yy" });
  $("#kasa-bakiye-listesi-filter-bitis-tarihi").datepicker({ dateFormat: "dd/mm/yy" });
};

$("#menu-kasa-bakiye-listesi-btn").on("click", menuKasaBakiyeListesiUi);

const kasaBakiyeListesiFiltre = () => {
  let baslangicTarihi;
  let bitisTarihi;
  if ($("#kasa-bakiye-listesi-filter-baslangic-tarihi").val() && $("#kasa-bakiye-listesi-filter-bitis-tarihi").val()) {
    baslangicTarihi = new Date($("#kasa-bakiye-listesi-filter-baslangic-tarihi").datepicker("getDate").getTime()).toJSON();
    bitisTarihi = new Date($("#kasa-bakiye-listesi-filter-bitis-tarihi").datepicker("getDate").getTime());
    bitisTarihi.setDate(bitisTarihi.getDate() + 1);
    bitisTarihi = bitisTarihi.toJSON().replace("21:00:00.000Z", "20:59:59.000Z");
  }

  let dateFilteredKasaHareket = kasaHareket.filter((item) => new Date(item.tarih).getTime() >= new Date(baslangicTarihi).getTime() && new Date(item.tarih).getTime() < new Date(bitisTarihi).getTime());
  let devredenKasaHareket = kasaHareket.filter((item) => new Date(item.tarih).getTime() < new Date(baslangicTarihi).getTime());

  let dateFilteredKasaHareketByKasa = kasaTanim.map((item) => {
    let values = dateFilteredKasaHareket.filter((x) => x.kasaKodu === item.kod);
    if (values.length === 0) {
      values.push({ kasaKodu: item.kod });
    }
    return values;
  });

  let devredenKasaHareketByKasa = kasaTanim.map((item) => {
    let values = devredenKasaHareket.filter((x) => x.kasaKodu === item.kod);
    if (values.length === 0) {
      values.push({ kasaKodu: item.kod });
    }
    return values;
  });

  let filteredTableValues = dateFilteredKasaHareketByKasa.map((item) => {
    let kasaKodu = item[0].kasaKodu;
    let ad = getData(kasaKodu, "kod", kasaTanim).ad;
    let gelirToplam = Object.hasOwn(item[0], "gelir") ? item.reduce((acc, obj) => acc + obj.gelir, 0) : 0;
    let giderToplam = Object.hasOwn(item[0], "gider") ? item.reduce((acc, obj) => acc + obj.gider, 0) : 0;
    let gelirBakiyesi = gelirToplam > giderToplam ? gelirToplam - giderToplam : 0;
    let giderBakiyesi = gelirToplam < giderToplam ? giderToplam - gelirToplam : 0;
    return {
      kasaKodu: kasaKodu,
      ad: ad,
      gelirToplam: gelirToplam,
      giderToplam: giderToplam,
      gelirBakiyesi: gelirBakiyesi,
      giderBakiyesi: giderBakiyesi,
      devredenGelirBakiyesi: "",
      devredenGiderBakiyesi: "",
      toplamGelirBakiyesi: "",
      toplamGiderBakiyesi: "",
    };
  });

  let devredenTableValues = devredenKasaHareketByKasa.map((item) => {
    return {
      kasaKodu: item[0].kasaKodu,
      gelir: item.reduce((acc, obj) => acc + obj.gelir, 0),
      gider: item.reduce((acc, obj) => acc + obj.gider, 0),
    };
  });

  filteredTableValues.forEach((item) => {
    let elementIndex = devredenTableValues.findIndex((x) => x.kasaKodu === item.kasaKodu);
    item.devredenGelirBakiyesi = !isNaN(devredenTableValues[elementIndex].gelir) ? devredenTableValues[elementIndex].gelir : 0;
    item.devredenGiderBakiyesi = !isNaN(devredenTableValues[elementIndex].gider) ? devredenTableValues[elementIndex].gider : 0;
    item.toplamGelirBakiyesi =
      item.gelirBakiyesi + item.devredenGelirBakiyesi > item.giderBakiyesi + item.devredenGiderBakiyesi
        ? item.gelirBakiyesi + item.devredenGelirBakiyesi - (item.giderBakiyesi + item.devredenGiderBakiyesi)
        : 0;
    item.toplamGiderBakiyesi =
      item.gelirBakiyesi + item.devredenGelirBakiyesi < item.giderBakiyesi + item.devredenGiderBakiyesi
        ? item.giderBakiyesi + item.devredenGiderBakiyesi - (item.gelirBakiyesi + item.devredenGelirBakiyesi)
        : 0;
  });

  kasaBakiyeListesiTableFill(filteredTableValues);
};

const kasaBakiyeListesiTableFill = (source) => {
  $(".kasa-bakiye-listesi-table-body").html("");
  source.map((item) =>
    $(".kasa-bakiye-listesi-table-body").append(`<tr>
                <td>${item.kasaKodu}</td>
                <td>${item.ad}</td>
                <td>${item.gelirToplam}</td>
                <td>${item.giderToplam}</td>
                <td>${item.gelirBakiyesi}</td>
                <td>${item.giderBakiyesi}</td>
                <td>${item.devredenGelirBakiyesi}</td>
                <td>${item.devredenGiderBakiyesi}</td>
                <td>${item.toplamGelirBakiyesi}</td>
                <td>${item.toplamGiderBakiyesi}</td>
                </tr>`)
  );
};
