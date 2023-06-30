const menuKasaEkstreUi = () => {
  $("#app-screen").html("");
  $("#app-screen").append(`<div class="kasa-ekstre-screen">
        <h1 class="text-center">Kasa Ekstresi</h1>
        <div class="filter-container d-flex my-3">
          <div class="row align-items-center w-100">
           <div class="col-3">
              <label for="kasa-ekstre-filter-kod">Kasa Kodu:</label>
              <select name="kasa-ekstre-filter-kod" id="kasa-ekstre-filter-kod">
                <option value=""></option>
              </select>
            </div>
            <div class="col-4">
              <label for="kasa-ekstre-filter-baslangic-tarihi">Başlangıç Tarihi:</label>
              <input type="text" id="kasa-ekstre-filter-baslangic-tarihi" name="kasa-ekstre-filter-baslangic-tarihi" value="" />
            </div>
            <div class="col-4">
              <label for="kasa-ekstre-filter-bitis-tarihi">Bitiş Tarihi:</label>
              <input type="text" id="kasa-ekstre-filter-bitis-tarihi" name="kasa-ekstre-filter-bitis-tarihi" value="" />
            </div>
            <div class="col-1">
              <button class="btn btn-primary ms-2" id="kasa-ekstre-filter-btn" onclick="kasaEkstreFiltre()">Filtrele</button>
            </div>
          </div>
        </div>
        <div class="kasa-ekstre-table-screen">
        </div>
      </div>`);
  kasaTanim.map((item) => $("#kasa-ekstre-filter-kod").append(`<option value="${item.kod}">${item.ad}</option>`));
  $("#kasa-ekstre-filter-baslangic-tarihi").datepicker({ dateFormat: "dd/mm/yy" });
  $("#kasa-ekstre-filter-bitis-tarihi").datepicker({ dateFormat: "dd/mm/yy" });
};

$("#menu-kasa-ekstre-btn").on("click", menuKasaEkstreUi);

const kasaEkstreFiltre = () => {
  let kasaKodu = $("#kasa-ekstre-filter-kod").val();
  let baslangicTarihi = $("#kasa-ekstre-filter-baslangic-tarihi").val() ? new Date($("#kasa-ekstre-filter-baslangic-tarihi").datepicker("getDate").getTime()).toJSON() : new Date(0).toJSON();
  let bitisTarihi = $("#kasa-ekstre-filter-bitis-tarihi").val() ? new Date($("#kasa-ekstre-filter-bitis-tarihi").datepicker("getDate").getTime()) : new Date(999999999999999);
  bitisTarihi.setDate(bitisTarihi.getDate() + 1);
  bitisTarihi = bitisTarihi.toJSON().replace("21:00:00.000Z", "20:59:59.000Z");
  let filteredKasaTanim = kasaKodu !== "" ? kasaTanim.filter((item) => item.kod === kasaKodu) : kasaTanim;
  kasaEkstreTableCreate(filteredKasaTanim);
  let filteredKasaHareket = filteredKasaTanim.map((item) => {
    if (
      kasaHareket.filter(
        (hareket) => hareket.kasaKodu === item.kod && new Date(hareket.tarih).getTime() >= new Date(baslangicTarihi).getTime() && new Date(hareket.tarih).getTime() < new Date(bitisTarihi).getTime()
      ).length
    ) {
      return kasaHareket.filter(
        (hareket) => hareket.kasaKodu === item.kod && new Date(hareket.tarih).getTime() >= new Date(baslangicTarihi).getTime() && new Date(hareket.tarih).getTime() < new Date(bitisTarihi).getTime()
      );
    } else {
      return [{ kasaKodu: `${item.kod}`, gelir: 0, gider: 0 }];
    }
  });
  let devredenKasaHareket = filteredKasaTanim.map((item) => {
    if (kasaHareket.filter((hareket) => hareket.kasaKodu === item.kod && new Date(hareket.tarih).getTime() < new Date(baslangicTarihi).getTime()).length) {
      return kasaHareket.filter((hareket) => hareket.kasaKodu === item.kod && new Date(hareket.tarih).getTime() < new Date(baslangicTarihi).getTime());
    } else {
      return [{ kasaKodu: `${item.kod}`, gelir: 0, gider: 0 }];
    }
  });
  devredenKasaHareket = devredenKasaHareket.map((item) => item.sort((a, b) => (new Date(a.tarih).getTime() > new Date(b.tarih).getTime() ? 1 : -1)));
  filteredKasaHareket = filteredKasaHareket.map((item) => item.sort((a, b) => (new Date(a.tarih).getTime() > new Date(b.tarih).getTime() ? 1 : -1)));
  kasaEkstreTableFill(filteredKasaHareket, devredenKasaHareket);
};

const kasaEkstreTableCreate = (source) => {
  $(".kasa-ekstre-table-screen").html("");
  source.forEach((item) =>
    $(".kasa-ekstre-table-screen").append(`<h3>${item.kod + " " + getData(item.kod, "kod", kasaTanim).ad}</h3>
            <table class="table table-hover">
              <thead>
                <tr>
                  <th scope="col">Hareket No</th>
                  <th scope="col">Hareket Tipi</th>
                  <th scope="col">Tarih</th>
                  <th scope="col">Gelir</th>
                  <th scope="col">Gider</th>
                  <th scope="col">Gelir Bakiyesi</th>
                  <th scope="col">Gider Bakiyesi</th>
                </tr>
              </thead>
              <tbody class="kasa-ekstre-${item.kod}-table-body"></tbody>
            </table>
            <br>
            <br>`)
  );
};

const kasaEkstreTableFill = (filtered, devreden) => {
  let devredenValues = devreden.map((item) => {
    let gelir = item.reduce((acc, obj) => acc + obj.gelir, 0);
    let gider = item.reduce((acc, obj) => acc + obj.gider, 0);
    let gelirBakiye = gelir >= gider ? gelir - gider : 0;
    let giderBakiye = gider > gelir ? gider - gelir : 0;
    return {
      kasaKodu: item[0] ? item[0].kasaKodu : "",
      no: "devreden",
      hareketTipi: "devreden",
      tarih: "devreden",
      gelir: gelir,
      gider: gider,
      gelirBakiye: gelirBakiye,
      giderBakiye: giderBakiye,
    };
  });

  devredenValues.forEach((item) =>
    $(`.kasa-ekstre-${item.kasaKodu}-table-body`).append(`<tr>
                  <td>${item.no}</td>
                  <td>${item.hareketTipi}</td>
                  <td>${item.tarih}</td>
                  <td>${currencyFormatter.format(item.gelir)}</td>
                  <td>${currencyFormatter.format(item.gider)}</td>
                  <td>${currencyFormatter.format(item.gelirBakiye)}</td>
                  <td>${currencyFormatter.format(item.giderBakiye)}</td>
                </tr>`)
  );

  filtered.forEach((tanim) => {
    let devredenGelir = devredenValues.filter((value) => value.kasaKodu === tanim[0].kasaKodu).length ? devredenValues.filter((value) => value.kasaKodu === tanim[0].kasaKodu)[0].gelir : 0;
    let devredenGider = devredenValues.filter((value) => value.kasaKodu === tanim[0].kasaKodu).length ? devredenValues.filter((value) => value.kasaKodu === tanim[0].kasaKodu)[0].gider : 0;
    tanim.forEach((item) => {
      let gelirBakiye = devredenGelir + item.gelir >= devredenGider + item.gider ? devredenGelir + item.gelir - (devredenGider + item.gider) : 0;
      let giderBakiye = devredenGelir + item.gelir < devredenGider + item.gider ? devredenGider + item.gider - (devredenGelir + item.gelir) : 0;
      item.tarih
        ? $(`.kasa-ekstre-${item.kasaKodu}-table-body`).append(`<tr>
                  <td>${item.no}</td>
                  <td>${item.hareketTipi}</td>
                  <td>${dateFormatter.format(new Date(item.tarih))}</td>
                  <td>${currencyFormatter.format(item.gelir)}</td>
                  <td>${currencyFormatter.format(item.gider)}</td>
                  <td>${currencyFormatter.format(gelirBakiye)}</td>
                  <td>${currencyFormatter.format(giderBakiye)}</td>
                </tr>`)
        : null;
      devredenGelir = gelirBakiye;
      devredenGider = giderBakiye;
    });
  });
};
//   let sumFiltered = filtered.map((item) => {
//     return {
//       cariKod: item[0].cariKod,
//       alacak: item.reduce((acc, obj) => acc + obj.alacak, 0),""
//       borc: item.reduce((acc, obj) => acc + obj.borc, 0),
//     };
//   });
//   let sumDevreden = devreden.map((item) => {
//     return {
//       cariKod: item[0].cariKod,
//       alacak: item.reduce((acc, obj) => acc + obj.alacak, 0),
//       borc: item.reduce((acc, obj) => acc + obj.borc, 0),
//     };
//   });
