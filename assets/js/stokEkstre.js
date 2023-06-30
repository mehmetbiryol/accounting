const menuStokEkstreUi = () => {
  $("#app-screen").html("");
  $("#app-screen").append(`<div class="stok-ekstre-screen">
        <h1 class="text-center">Stok Ekstresi</h1>
        <div class="filter-container d-flex my-3">
          <div class="row align-items-center w-100">
           <div class="col-3">
              <label for="stok-ekstre-filter-kod">Stok Kodu:</label>
              <select name="stok-ekstre-filter-kod" id="stok-ekstre-filter-kod">
                <option value=""></option>
              </select>
            </div>
            <div class="col-4">
              <label for="stok-ekstre-filter-baslangic-tarihi">Başlangıç Tarihi:</label>
              <input type="text" id="stok-ekstre-filter-baslangic-tarihi" name="stok-ekstre-filter-baslangic-tarihi" value="" />
            </div>
            <div class="col-4">
              <label for="stok-ekstre-filter-bitis-tarihi">Bitiş Tarihi:</label>
              <input type="text" id="stok-ekstre-filter-bitis-tarihi" name="stok-ekstre-filter-bitis-tarihi" value="" />
            </div>
            <div class="col-1">
              <button class="btn btn-primary ms-2" id="stok-ekstre-filter-btn" onclick="stokEkstreFiltre()">Filtrele</button>
            </div>
          </div>
        </div>
        <div class="stok-ekstre-table-screen">
        </div>
      </div>`);
  stokTanim.map((item) => $("#stok-ekstre-filter-kod").append(`<option value="${item.kod}">${item.ad}</option>`));
  $("#stok-ekstre-filter-baslangic-tarihi").datepicker({ dateFormat: "dd/mm/yy" });
  $("#stok-ekstre-filter-bitis-tarihi").datepicker({ dateFormat: "dd/mm/yy" });
};

$("#menu-stok-ekstre-btn").on("click", menuStokEkstreUi);

const stokEkstreFiltre = () => {
  let stokKodu = $("#stok-ekstre-filter-kod").val();
  let baslangicTarihi = $("#stok-ekstre-filter-baslangic-tarihi").val() ? new Date($("#stok-ekstre-filter-baslangic-tarihi").datepicker("getDate").getTime()).toJSON() : new Date(0).toJSON();
  let bitisTarihi = $("#stok-ekstre-filter-bitis-tarihi").val() ? new Date($("#stok-ekstre-filter-bitis-tarihi").datepicker("getDate").getTime()) : new Date(999999999999999);
  bitisTarihi.setDate(bitisTarihi.getDate() + 1);
  bitisTarihi = bitisTarihi.toJSON().replace("21:00:00.000Z", "20:59:59.000Z");
  let filteredStokTanim = stokKodu !== "" ? stokTanim.filter((item) => item.kod === stokKodu) : stokTanim;
  stokEkstreTableCreate(filteredStokTanim);
  let filteredStokHareket = filteredStokTanim.map((item) => {
    if (
      stokHareket.filter(
        (hareket) => hareket.stokKodu === item.kod && new Date(hareket.tarih).getTime() >= new Date(baslangicTarihi).getTime() && new Date(hareket.tarih).getTime() < new Date(bitisTarihi).getTime()
      ).length
    ) {
      return stokHareket.filter(
        (hareket) => hareket.stokKodu === item.kod && new Date(hareket.tarih).getTime() >= new Date(baslangicTarihi).getTime() && new Date(hareket.tarih).getTime() < new Date(bitisTarihi).getTime()
      );
    } else {
      return [{ stokKodu: `${item.kod}`, girenMiktar: 0, cikanMiktar: 0 }];
    }
  });
  let devredenStokHareket = filteredStokTanim.map((item) => {
    if (stokHareket.filter((hareket) => hareket.stokKodu === item.kod && new Date(hareket.tarih).getTime() < new Date(baslangicTarihi).getTime()).length) {
      return stokHareket.filter((hareket) => hareket.stokKodu === item.kod && new Date(hareket.tarih).getTime() < new Date(baslangicTarihi).getTime());
    } else {
      return [{ stokKodu: `${item.kod}`, girenMiktar: 0, cikanMiktar: 0 }];
    }
  });
  devredenStokHareket = devredenStokHareket.map((item) => item.sort((a, b) => (new Date(a.tarih).getTime() > new Date(b.tarih).getTime() ? 1 : -1)));
  filteredStokHareket = filteredStokHareket.map((item) => item.sort((a, b) => (new Date(a.tarih).getTime() > new Date(b.tarih).getTime() ? 1 : -1)));
  stokEkstreTableFill(filteredStokHareket, devredenStokHareket);
};

const stokEkstreTableCreate = (source) => {
  $(".stok-ekstre-table-screen").html("");
  source.forEach((item) =>
    $(".stok-ekstre-table-screen").append(`<h3>${item.kod + " " + getData(item.kod, "kod", stokTanim).ad}</h3>
            <table class="table table-hover">
              <thead>
                <tr>
                  <th scope="col">Hareket No</th>
                  <th scope="col">Hareket Tipi</th>
                  <th scope="col">Tarih</th>
                  <th scope="col">Giren Miktar</th>
                  <th scope="col">Çıkan Miktar</th>
                  <th scope="col">Giren Bakiyesi</th>
                  <th scope="col">Çıkan Bakiyesi</th>
                </tr>
              </thead>
              <tbody class="stok-ekstre-${item.kod}-table-body"></tbody>
            </table>
            <br>
            <br>`)
  );
};

const stokEkstreTableFill = (filtered, devreden) => {
  let devredenValues = devreden.map((item) => {
    let girenMiktar = item.reduce((acc, obj) => acc + obj.girenMiktar, 0);
    let cikanMiktar = item.reduce((acc, obj) => acc + obj.cikanMiktar, 0);
    let girenBakiye = girenMiktar >= cikanMiktar ? girenMiktar - cikanMiktar : 0;
    let cikanBakiye = cikanMiktar > girenMiktar ? cikanMiktar - girenMiktar : 0;
    return {
      stokKodu: item[0] ? item[0].stokKodu : "",
      no: "devreden",
      hareketTipi: "devreden",
      tarih: "devreden",
      girenMiktar: girenMiktar,
      cikanMiktar: cikanMiktar,
      girenBakiye: girenBakiye,
      cikanBakiye: cikanBakiye,
    };
  });

  devredenValues.forEach((item) =>
    $(`.stok-ekstre-${item.stokKodu}-table-body`).append(`<tr>
                  <td>${item.no}</td>
                  <td>${item.hareketTipi}</td>
                  <td>${item.tarih}</td>
                  <td>${item.girenMiktar}</td>
                  <td>${item.cikanMiktar}</td>
                  <td>${item.girenBakiye}</td>
                  <td>${item.cikanBakiye}</td>
                </tr>`)
  );

  filtered.forEach((tanim) => {
    let devredenGiren = devredenValues.filter((value) => value.stokKodu === tanim[0].stokKodu).length ? devredenValues.filter((value) => value.stokKodu === tanim[0].stokKodu)[0].girenBakiye : 0;
    let devredenCikan = devredenValues.filter((value) => value.stokKodu === tanim[0].stokKodu).length ? devredenValues.filter((value) => value.stokKodu === tanim[0].stokKodu)[0].cikanBakiye : 0;
    tanim.forEach((item) => {
      let girenBakiye = devredenGiren + item.girenMiktar >= devredenCikan + item.cikanMiktar ? devredenGiren + item.girenMiktar - (devredenCikan + item.cikanMiktar) : 0;
      let cikanBakiye = devredenGiren + item.girenMiktar < devredenCikan + item.cikanMiktar ? devredenCikan + item.cikanMiktar - (devredenGiren + item.girenMiktar) : 0;
      item.tarih
        ? $(`.stok-ekstre-${item.stokKodu}-table-body`).append(`<tr>
                  <td>${item.no}</td>
                  <td>${item.hareketTipi}</td>
                  <td>${dateFormatter.format(new Date(item.tarih))}</td>
                  <td>${item.girenMiktar}</td>
                  <td>${item.cikanMiktar}</td>
                  <td>${girenBakiye}</td>
                  <td>${cikanBakiye}</td>
                </tr>`)
        : null;
      devredenGiren = girenBakiye;
      devredenCikan = cikanBakiye;
    });
  });

  let sumFiltered = filtered.map((item) => {
    return {
      cariKod: item[0].cariKod,
      alacak: item.reduce((acc, obj) => acc + obj.alacak, 0),
      borc: item.reduce((acc, obj) => acc + obj.borc, 0),
    };
  });
  let sumDevreden = devreden.map((item) => {
    return {
      cariKod: item[0].cariKod,
      alacak: item.reduce((acc, obj) => acc + obj.alacak, 0),
      borc: item.reduce((acc, obj) => acc + obj.borc, 0),
    };
  });
};
