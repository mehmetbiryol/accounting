const menuCariEkstreUi = () => {
  $("#app-screen").html("");
  $("#app-screen").append(`<div class="cari-ekstre-screen">
        <h1 class="text-center">Cari Hesap Ekstresi</h1>
        <div class="filter-container d-flex my-3">
          <div class="row align-items-center w-100">
           <div class="col-3">
              <label for="cari-ekstre-filter-kod">Cari Kod:</label>
              <select name="cari-ekstre-filter-kod" id="cari-ekstre-filter-kod">
                <option value=""></option>
              </select>
            </div>
            <div class="col-4">
              <label for="cari-ekstre-filter-baslangic-tarihi">Başlangıç Tarihi:</label>
              <input type="text" id="cari-ekstre-filter-baslangic-tarihi" name="cari-ekstre-filter-baslangic-tarihi" value="" />
            </div>
            <div class="col-4">
              <label for="cari-ekstre-filter-bitis-tarihi">Bitiş Tarihi:</label>
              <input type="text" id="cari-ekstre-filter-bitis-tarihi" name="cari-ekstre-filter-bitis-tarihi" value="" />
            </div>
            <div class="col-1">
              <button class="btn btn-primary ms-2" id="cari-ekstre-filter-btn" onclick="cariEkstreFiltre()">Filtrele</button>
            </div>
          </div>
        </div>
        <div class="cari-ekstre-table-screen">
        </div>
      </div>`);
  cariTanim.map((item) => $("#cari-ekstre-filter-kod").append(`<option value="${item.kod}">${item.ticariUnvan}</option>`));
  $("#cari-ekstre-filter-baslangic-tarihi").datepicker({ dateFormat: "dd/mm/yy" });
  $("#cari-ekstre-filter-bitis-tarihi").datepicker({ dateFormat: "dd/mm/yy" });
};

$("#menu-cari-ekstre-btn").on("click", menuCariEkstreUi);

const cariEkstreFiltre = () => {
  let cariKod = $("#cari-ekstre-filter-kod").val();
  let baslangicTarihi = $("#cari-ekstre-filter-baslangic-tarihi").val() ? new Date($("#cari-ekstre-filter-baslangic-tarihi").datepicker("getDate").getTime()).toJSON() : new Date(0).toJSON();
  let bitisTarihi = $("#cari-ekstre-filter-bitis-tarihi").val() ? new Date($("#cari-ekstre-filter-bitis-tarihi").datepicker("getDate").getTime()) : new Date(999999999999999);
  bitisTarihi.setDate(bitisTarihi.getDate() + 1);
  bitisTarihi = bitisTarihi.toJSON().replace("21:00:00.000Z", "20:59:59.000Z");
  console.log(bitisTarihi);
  let filteredCariTanim = cariKod !== "" ? cariTanim.filter((item) => item.kod === cariKod) : cariTanim;
  cariEkstreTableCreate(filteredCariTanim);
  let filteredCariHareket = filteredCariTanim.map((item) => {
    if (
      cariHareket.filter(
        (hareket) => hareket.cariKod === item.kod && new Date(hareket.tarih).getTime() >= new Date(baslangicTarihi).getTime() && new Date(hareket.tarih).getTime() < new Date(bitisTarihi).getTime()
      ).length
    ) {
      return cariHareket.filter(
        (hareket) => hareket.cariKod === item.kod && new Date(hareket.tarih).getTime() >= new Date(baslangicTarihi).getTime() && new Date(hareket.tarih).getTime() < new Date(bitisTarihi).getTime()
      );
    } else {
      return [{ cariKod: `${item.kod}`, alacak: 0, borc: 0 }];
    }
  });
  let devredenCariHareket = filteredCariTanim.map((item) => {
    if (cariHareket.filter((hareket) => hareket.cariKod === item.kod && new Date(hareket.tarih).getTime() < new Date(baslangicTarihi).getTime()).length) {
      return cariHareket.filter((hareket) => hareket.cariKod === item.kod && new Date(hareket.tarih).getTime() < new Date(baslangicTarihi).getTime());
    } else {
      return [{ cariKod: `${item.kod}`, alacak: 0, borc: 0 }];
    }
  });
  devredenCariHareket = devredenCariHareket.map((item) => item.sort((a, b) => (new Date(a.tarih).getTime() > new Date(b.tarih).getTime() ? 1 : -1)));
  filteredCariHareket = filteredCariHareket.map((item) => item.sort((a, b) => (new Date(a.tarih).getTime() > new Date(b.tarih).getTime() ? 1 : -1)));
  cariEkstreTableFill(filteredCariHareket, devredenCariHareket);
};

const cariEkstreTableCreate = (source) => {
  $(".cari-ekstre-table-screen").html("");
  source.forEach((item) =>
    $(".cari-ekstre-table-screen").append(`<h3>${item.kod + " " + getData(item.kod, "kod", cariTanim).ticariUnvan}</h3>
            <table class="table table-hover">
              <thead>
                <tr>
                  <th scope="col">Hareket No</th>
                  <th scope="col">Hareket Tipi</th>
                  <th scope="col">Tarih</th>
                  <th scope="col">Alacak Tutar</th>
                  <th scope="col">Borç Tutar</th>
                  <th scope="col">Alacak Bakiyesi</th>
                  <th scope="col">Borç Bakiyesi</th>
                </tr>
              </thead>
              <tbody class="cari-ekstre-${item.kod}-table-body"></tbody>
            </table>
            <br>
            <br>`)
  );
};

const cariEkstreTableFill = (filtered, devreden) => {
  let devredenValues = devreden.map((item) => {
    let alacak = item.reduce((acc, obj) => acc + obj.alacak, 0);
    let borc = item.reduce((acc, obj) => acc + obj.borc, 0);
    let alacakBakiye = alacak >= borc ? alacak - borc : 0;
    let borcBakiye = borc > alacak ? borc - alacak : 0;
    return {
      cariKod: item[0] ? item[0].cariKod : "",
      no: "devreden",
      hareketTipi: "devreden",
      tarih: "devreden",
      alacak: alacak,
      borc: borc,
      alacakBakiye: alacakBakiye,
      borcBakiye: borcBakiye,
    };
  });

  devredenValues.forEach((item) =>
    $(`.cari-ekstre-${item.cariKod}-table-body`).append(`<tr>
                  <td>${item.no}</td>
                  <td>${item.hareketTipi}</td>
                  <td>${item.tarih}</td>
                  <td>${currencyFormatter.format(item.alacak)}</td>
                  <td>${currencyFormatter.format(item.borc)}</td>
                  <td>${currencyFormatter.format(item.alacakBakiye)}</td>
                  <td>${currencyFormatter.format(item.borcBakiye)}</td>
                </tr>`)
  );

  filtered.forEach((tanim) => {
    let devredenAlacak = devredenValues.filter((value) => value.cariKod === tanim[0].cariKod).length ? devredenValues.filter((value) => value.cariKod === tanim[0].cariKod)[0].alacakBakiye : 0;
    let devredenBorc = devredenValues.filter((value) => value.cariKod === tanim[0].cariKod).length ? devredenValues.filter((value) => value.cariKod === tanim[0].cariKod)[0].borcBakiye : 0;
    tanim.forEach((item) => {
      let alacakBakiye = devredenAlacak + item.alacak >= devredenBorc + item.borc ? devredenAlacak + item.alacak - (devredenBorc + item.borc) : 0;
      let borcBakiye = devredenAlacak + item.alacak < devredenBorc + item.borc ? devredenBorc + item.borc - (devredenAlacak + item.alacak) : 0;
      item.tarih
        ? $(`.cari-ekstre-${item.cariKod}-table-body`).append(`<tr>
                  <td>${item.no}</td>
                  <td>${item.hareketTipi}</td>
                  <td>${dateFormatter.format(new Date(item.tarih))}</td>
                  <td>${currencyFormatter.format(item.alacak)}</td>
                  <td>${currencyFormatter.format(item.borc)}</td>
                  <td>${currencyFormatter.format(alacakBakiye)}</td>
                  <td>${currencyFormatter.format(borcBakiye)}</td>
                </tr>`)
        : null;
      devredenAlacak = alacakBakiye;
      devredenBorc = borcBakiye;
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
