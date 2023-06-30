const menuStokBakiyeListesiUi = () => {
  $("#app-screen").html("");
  $("#app-screen").append(`<div class="stok-bakiye-listesi-screen">
        <h1 class="text-center">Stok Bakiye Listesi</h1>
        <div class="filter-container d-flex my-3">
          <div class="row align-items-center w-100">
            <div class="col-4">
              <label for="stok-bakiye-listesi-filter-baslangic-tarihi">Başlangıç Tarihi:</label>
              <input type="text" id="stok-bakiye-listesi-filter-baslangic-tarihi" name="stok-bakiye-listesi-filter-baslangic-tarihi" value="" />
            </div>
            <div class="col-4">
              <label for="stok-bakiye-listesi-filter-bitis-tarihi">Bitiş Tarihi:</label>
              <input type="text" id="stok-bakiye-listesi-filter-bitis-tarihi" name="stok-bakiye-listesi-filter-bitis-tarihi" value="" />
            </div>
            <div class="col-1">
              <button class="btn btn-primary ms-2" id="stok-bakiye-listesi-filter-btn" onclick="stokBakiyeListesiFiltre()">Filtrele</button>
            </div>
          </div>
        </div>
        <div class="stok-bakiye-listesi-table-screen">
          <table class="table table-hover">
            <thead>
              <tr>
                <th scope="col">Stok Kodu</th>
                <th scope="col">Stok Adı</th>
                <th scope="col">Stok Giriş Toplam</th>
                <th scope="col">Stok Çıkış Toplam</th>
                <th scope="col">Stok Giriş Bakiyesi</th>
                <th scope="col">Stok Çıkış Bakiyesi</th>
                <th scope="col">Devreden Giriş Bakiyesi</th>
                <th scope="col">Devreden Çıkış Bakiyesi</th>
                <th scope="col">Toplam Giriş Bakiyesi</th>
                <th scope="col">Toplam Çıkış Bakiyesi</th>
              </tr>
            </thead>
            <tbody class="stok-bakiye-listesi-table-body"></tbody>
          </table>
        </div>
      </div>`);
  $("#stok-bakiye-listesi-filter-baslangic-tarihi").datepicker({ dateFormat: "dd/mm/yy" });
  $("#stok-bakiye-listesi-filter-bitis-tarihi").datepicker({ dateFormat: "dd/mm/yy" });
};

$("#menu-stok-bakiye-listesi-btn").on("click", menuStokBakiyeListesiUi);

const stokBakiyeListesiFiltre = () => {
  let baslangicTarihi;
  let bitisTarihi;
  if ($("#stok-bakiye-listesi-filter-baslangic-tarihi").val() && $("#stok-bakiye-listesi-filter-bitis-tarihi").val()) {
    baslangicTarihi = new Date($("#stok-bakiye-listesi-filter-baslangic-tarihi").datepicker("getDate").getTime()).toJSON();
    bitisTarihi = new Date($("#stok-bakiye-listesi-filter-bitis-tarihi").datepicker("getDate").getTime());
    bitisTarihi.setDate(bitisTarihi.getDate() + 1);
    bitisTarihi = bitisTarihi.toJSON().replace("21:00:00.000Z", "20:59:59.000Z");
  }

  let dateFilteredStokHareket = stokHareket.filter((item) => new Date(item.tarih).getTime() >= new Date(baslangicTarihi).getTime() && new Date(item.tarih).getTime() < new Date(bitisTarihi).getTime());
  let devredenStokHareket = stokHareket.filter((item) => new Date(item.tarih).getTime() < new Date(baslangicTarihi).getTime());

  let dateFilteredStokHareketByStok = stokTanim.map((item) => {
    let values = dateFilteredStokHareket.filter((x) => x.stokKodu === item.kod);
    if (values.length === 0) {
      values.push({ stokKodu: item.kod });
    }
    return values;
  });

  let devredenStokHareketByStok = stokTanim.map((item) => {
    let values = devredenStokHareket.filter((x) => x.stokKodu === item.kod);
    if (values.length === 0) {
      values.push({ stokKodu: item.kod });
    }
    return values;
  });

  let filteredTableValues = dateFilteredStokHareketByStok.map((item) => {
    let stokKodu = item[0].stokKodu;
    let ad = getData(stokKodu, "kod", stokTanim).ad;
    let girisToplam = Object.hasOwn(item[0], "girenMiktar") ? item.reduce((acc, obj) => acc + obj.girenMiktar, 0) : 0;
    let cikisToplam = Object.hasOwn(item[0], "cikanMiktar") ? item.reduce((acc, obj) => acc + obj.cikanMiktar, 0) : 0;
    let girisBakiyesi = girisToplam > cikisToplam ? girisToplam - cikisToplam : 0;
    let cikisBakiyesi = girisToplam < cikisToplam ? cikisToplam - girisToplam : 0;
    return {
      stokKodu: stokKodu,
      ad: ad,
      girisToplam: girisToplam,
      cikisToplam: cikisToplam,
      girisBakiyesi: girisBakiyesi,
      cikisBakiyesi: cikisBakiyesi,
      devredenGirisBakiyesi: "",
      devredenCikisBakiyesi: "",
      toplamGirisBakiyesi: "",
      toplamCikisBakiyesi: "",
    };
  });

  let devredenTableValues = devredenStokHareketByStok.map((item) => {
    return {
      stokKodu: item[0].stokKodu,
      girenMiktar: item.reduce((acc, obj) => acc + obj.girenMiktar, 0),
      cikanMiktar: item.reduce((acc, obj) => acc + obj.cikanMiktar, 0),
    };
  });

  filteredTableValues.forEach((item) => {
    let elementIndex = devredenTableValues.findIndex((x) => x.stokKodu === item.stokKodu);
    item.devredenGirisBakiyesi = !isNaN(devredenTableValues[elementIndex].girenMiktar) ? devredenTableValues[elementIndex].girenMiktar : 0;
    item.devredenCikisBakiyesi = !isNaN(devredenTableValues[elementIndex].cikanMiktar) ? devredenTableValues[elementIndex].cikanMiktar : 0;
    item.toplamGirisBakiyesi =
      item.girisBakiyesi + item.devredenGirisBakiyesi > item.cikisBakiyesi + item.devredenCikisBakiyesi
        ? item.girisBakiyesi + item.devredenGirisBakiyesi - (item.cikisBakiyesi + item.devredenCikisBakiyesi)
        : 0;
    item.toplamCikisBakiyesi =
      item.girisBakiyesi + item.devredenGirisBakiyesi < item.cikisBakiyesi + item.devredenCikisBakiyesi
        ? item.cikisBakiyesi + item.devredenCikisBakiyesi - (item.girisBakiyesi + item.devredenGirisBakiyesi)
        : 0;
  });

  stokBakiyeListesiTableFill(filteredTableValues);
};

const stokBakiyeListesiTableFill = (source) => {
  $(".stok-bakiye-listesi-table-body").html("");
  source.map((item) =>
    $(".stok-bakiye-listesi-table-body").append(`<tr>
                <td>${item.stokKodu}</td>
                <td>${item.ad}</td>
                <td>${item.girisToplam}</td>
                <td>${item.cikisToplam}</td>
                <td>${item.girisBakiyesi}</td>
                <td>${item.cikisBakiyesi}</td>
                <td>${item.devredenGirisBakiyesi}</td>
                <td>${item.devredenCikisBakiyesi}</td>
                <td>${item.toplamGirisBakiyesi}</td>
                <td>${item.toplamCikisBakiyesi}</td>
                </tr>`)
  );
};
