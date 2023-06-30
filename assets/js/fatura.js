let faturaTipi;
let faturaKalemCurrent;
const menuFaturaUi = () => {
  $("#app-screen").html("");
  $("#app-screen").append(`<h1 class="text-center">Faturalar</h1>
          <div class="filter-container d-flex justify-content-center my-3">
            <input class="w-100 px-2" type="text" id="fatura-filter" name="fatura-filter" placeholder="Filtrele"/>
            <button class="btn btn-primary ms-2" id="fatura-filter-btn">Filtrele</button>
          </div>
          <div class="fatura-screen">
            <div class="table-add-container d-flex justify-content-end gap-2">
              <button type="button" class="btn btn-primary alisEkle">Alış Faturası Ekle</button>
              <button type="button" class="btn btn-success satisEkle">Satış Faturası Ekle</button>
            </div>
            <table class="table table-hover">
              <thead>
                <tr>
                  <th scope="col" data-sort-order="original" data-sort-by="no">Fatura No</th>
                  <th scope="col" data-sort-order="original" data-sort-by="cariKod">Cari Kod</th>
                  <th scope="col" data-sort-order="original" data-sort-by="tarih">Tarih</th>
                  <th scope="col" data-sort-order="original" data-sort-by="toplam">Toplam</th>
                  <th scope="col" data-sort-order="original" data-sort-by="iskontoOran">İskonto Oranı %</th>
                  <th scope="col" data-sort-order="original" data-sort-by="araToplam">Ara Toplam</th>
                  <th scope="col" data-sort-order="original" data-sort-by="kdv">KDV %</th>
                  <th scope="col" data-sort-order="original" data-sort-by="genelToplam">Genel Toplam</th>
                  <th scope="col" data-sort-order="original" data-sort-by="faturaTipi">Fatura Tipi</th>
                </tr>
              </thead>
              <tbody class="fatura-table-body">
              </tbody>
            </table>
          </div>`);
  faturaTableFill(fatura);
  $(".fatura-table-body tr").on("click", faturaDuzenle);
  $(".alisEkle").on("click", faturaDuzenle);
  $(".satisEkle").on("click", faturaDuzenle);
  $("#fatura-filter-btn").on("click", faturaFiltre);
  $("thead th").on("click", sortTableFatura);
};

$("#menu-fatura-btn").on("click", menuFaturaUi);

const faturaTableFill = (source) => {
  $(".fatura-table-body").html("");
  source.map((item) =>
    $(".fatura-table-body").append(`<tr data-kod="${item.no}">
                  <td>${item.no}</td>
                  <td>${item.cariKod}</td>
                  <td>${dateFormatter.format(new Date(item.tarih))}</td>
                  <td>${currencyFormatter.format(item.toplam)}</td>
                  <td>${kdvFormatter.format(item.iskontoOran)}</td>
                  <td>${currencyFormatter.format(item.araToplam)}</td>
                  <td>${kdvFormatter.format(item.kdv)}</td>
                  <td>${currencyFormatter.format(item.genelToplam)}</td>
                  <td>${item.faturaTipi}</td>
                </tr>`)
  );
};

const sortTableFatura = (e) => {
  faturaTableFill(sortTable(e, fatura));
  $(".fatura-table-body tr").on("click", faturaDuzenle);
};

const faturaFiltre = () => {
  $(".fatura-table-body").html("");
  let filteredItems = searchData($("#fatura-filter").val(), fatura);
  faturaTableFill(filteredItems);
  $(".fatura-table-body tr").on("click", faturaDuzenle);
};

const faturaDuzenle = (e) => {
  if (e.target.classList.contains("satisEkle")) {
    faturaTipi = "Satış Faturası";
  } else if (e.target.classList.contains("alisEkle")) {
    faturaTipi = "Alış Faturası";
  }
  let currentData = getData($(e.target).parents("tr").data("kod"), "no", fatura);
  let data =
    currentData != null
      ? currentData
      : {
          id: fatura.length ? fatura[fatura.length - 1].id + 1 : 1,
          no: "",
          cariKod: "",
          tarih: Date.now(),
          toplam: 0,
          iskontoOran: 0,
          iskontoTutar: 0,
          araToplam: 0,
          kdv: 0,
          kdvTutar: 0,
          genelToplam: 0,
          faturaTipi: faturaTipi,
        };
  faturaInputFill(data);
};

const faturaInputFill = (data) => {
  $("#app-screen").html("");
  $("#app-screen").append(`<div class="row">
          <div class="fatura-ekle-screen-top row justify-content-between px-5">
            <h1 class="text-center">Fatura Düzenle</h1>
            <div class="d-flex justify-content-between mt-4 col-5 position-relative fatura-no-container">
              <label for="fatura-no-input">Fatura No: <sup>*</sup></label>
              <input type="text" autofocus onchange="faturaInputFillByNo(event)" id="fatura-no-input" name="fatura-no-input" value="${data.no}"/>
            </div>
            <div class="d-flex justify-content-between mt-4 col-5">
              <label for="fatura-cari-kod-input">Cari Kod: <sup>*</sup></label>
              <input type="text" onchange="faturaInputFillByCariKod(event)" id="fatura-cari-kod-input" name="fatura-cari-kod-input" value="${data.cariKod}"/>
            </div>
            <div class="d-flex justify-content-between mt-2 col-5">
              <label for="fatura-tarih-input">Tarih: <sup>*</sup></label>
              <input type="text" id="fatura-tarih-input" name="fatura-tarih-input" value="${dateFormatter.format(new Date(data.tarih))}"/>
            </div>
            <div class="d-flex justify-content-between mt-2 col-5">
              <label for="fatura-ticari-unvan-input">Ticari Ünvan: <sup>*</sup></label>
              <input type="text" id="fatura-ticari-unvan-input" name="fatura-ticari-unvan-input" value="${data.cariKod != "" ? getData(data.cariKod, "kod", cariTanim).ticariUnvan : ""}"/>
            </div>
          </div>
        </div>
        <div class="row mt-5 mx-3 fatura-kalem-ekle-screen">
        </div>`);
  if (data.faturaTipi == "Satış Faturası") {
    faturaTipi = "Satış Faturası";
    $(".fatura-no-container").append(`<button onclick="faturaAutoKod()"  class="fatura-autokod-btn btn btn-primary">Auto Kod</button>`);
  } else {
    faturaTipi = "Alış Faturası";
  }
  let currentKalemData = filterData(data.no, "faturaNo", faturaKalem);

  faturaKalemTableFill(currentKalemData);

  $("#app-screen").append(`<div class="fatura-ekle-screen-bottom mt-3 row justify-content-end">
          <div class="d-flex justify-content-end gap-4 mt-2 col-7 pe-5">
            <label for="fatura-toplam-input">Toplam: <sup>*</sup></label>
            <input type="text" onfocusin="currencyInputReverseFormatter(event)" onfocusout="currencyInputFormatter(event)" id="fatura-toplam-input" name="fatura-toplam-input" value="${currencyFormatter.format(
              data.toplam
            )}"/>
          </div>
          <div class="d-flex justify-content-end gap-4 mt-2 col-7 pe-5">
            <label for="fatura-iskonto-oran-input">İskonto: <sup>*</sup></label>
            <div class="row justify-content-end double-input">
              <div class="col-4">
                <input class="w-100" type="text" id="fatura-iskonto-oran-input" onchange="faturaTotals()" name="fatura-iskonto-oran-input" value="${kdvFormatter.format(data.iskontoOran)}"/>
              </div>
              <div class="col-8">
                <input class="w-100" type="text" onfocusin="currencyInputReverseFormatter(event)" onfocusout="currencyInputFormatter(event)" id="fatura-iskonto-tutar-input" name="fatura-iskonto-tutar-input" value="${currencyFormatter.format(
                  data.iskontoTutar
                )}"/>
              </div>
            </div>
          </div>
          <div class="d-flex justify-content-end gap-4 mt-2 col-7 pe-5">
            <label for="fatura-ara-toplam-input">Ara Toplam: <sup>*</sup></label>
            <input type="text" onfocusin="currencyInputReverseFormatter(event)" onfocusout="currencyInputFormatter(event)" id="fatura-ara-toplam-input" name="fatura-ara-toplam-input" value="${currencyFormatter.format(
              data.araToplam
            )}"/>
          </div>
          <div class="d-flex justify-content-end gap-4 mt-2 col-7 pe-5">
            <label for="fatura-kdv-input">Kdv: <sup>*</sup></label>
            <div class="row justify-content-end double-input">
              <div class="col-4">
                <input class="w-100" type="text" id="fatura-kdv-input" onchange="faturaTotals()" name="fatura-kdv-input" value="${kdvFormatter.format(data.kdv)}"/>
              </div>
              <div class="col-8">
                <input class="w-100" type="text" onfocusin="currencyInputReverseFormatter(event)" onfocusout="currencyInputFormatter(event)" id="fatura-kdv-tutar-input" name="fatura-kdv-tutar-input" value="${currencyFormatter.format(
                  data.kdvTutar
                )}"/>
              </div>
            </div>
          </div>
          <div class="d-flex justify-content-end gap-4 mt-2 col-7 pe-5">
            <label for="fatura-genel-toplam-input">Genel Toplam: <sup>*</sup></label>
            <input type="text" onfocusin="currencyInputReverseFormatter(event)" onfocusout="currencyInputFormatter(event)" id="fatura-genel-toplam-input" name="fatura-genel-toplam-input" value="${currencyFormatter.format(
              data.genelToplam
            )}"/>
          </div>
          <div class="d-flex justify-content-end mt-3 col-7 gap-2 pe-5">
            <button type="button" onclick="menuFaturaUi()" class="btn btn-warning cancelBtn">İptal</button>
            <button data-fatura-no="${data.no}" onclick="faturaDelete(event)" type="button" class="btn btn-danger deleteBtn">Sil</button>
            <button id="fatura-kaydet" onclick="faturaKaydetBtn()" type="button" class="btn btn-success">Kaydet</button>
          </div>
        </div>`);
  faturaTotals();
  $("#fatura-tarih-input").datepicker({ dateFormat: "dd/mm/yy" });
};

const faturaAutoKod = () => {
  //let satısFaturaları = filterData("Satış Faturası", "faturaTipi", fatura)
  $("#fatura-no-input").val(autoKod($("#fatura-no-input").val(), "no", fatura));
};

const faturaInputFillByCariKod = () => $("#fatura-ticari-unvan-input").val($("#fatura-cari-kod-input").val() != "" ? getData($("#fatura-cari-kod-input").val(), "kod", cariTanim).ticariUnvan : "");

const faturaInputFillByNo = (e) => {
  let data = getData(e.target.value, "no", fatura);
  if (data != null) {
    faturaInputFill(data);
  }
};

const faturaKaydetBtn = () => {
  if (
    $("#fatura-no-input").val() &&
    $("#fatura-cari-kod-input").val() &&
    $("#fatura-tarih-input").val()
    //check inputs more
  ) {
    if (getIndex($("#fatura-cari-kod-input").val(), "kod", cariTanim) > -1) {
      faturaEkle();
      faturaCariHareketEkle();
      faturaFaturaKalemEkle();
      faturaStokHareketEkle();
      menuFaturaUi();
    } else {
      alert("Bu cari koda sahip bir cari tanım bulunamadı!");
    }
  } else {
    alert("Lütfen gerekli alanları doldurunuz!");
  }
};

const faturaEkle = () => {
  addData(
    {
      id: fatura.length ? fatura[fatura.length - 1].id + 1 : 1,
      no: $("#fatura-no-input").val(),
      cariKod: $("#fatura-cari-kod-input").val(),
      tarih: new Date($("#fatura-tarih-input").datepicker("getDate").getTime()).toJSON(),
      toplam: +currencyReverseFormatter($("#fatura-toplam-input").val()),
      iskontoOran: +$("#fatura-iskonto-oran-input").val(),
      iskontoTutar: +currencyReverseFormatter($("#fatura-iskonto-tutar-input").val()),
      araToplam: +currencyReverseFormatter($("#fatura-ara-toplam-input").val()),
      kdv: +$("#fatura-kdv-input").val(),
      kdvTutar: +currencyReverseFormatter($("#fatura-kdv-tutar-input").val()),
      genelToplam: +currencyReverseFormatter($("#fatura-genel-toplam-input").val()),
      faturaTipi: faturaTipi,
    },
    "no",
    fatura
  );
};

const faturaCariHareketEkle = () => {
  let cariHareketEntries = filterData($("#fatura-cari-kod-input").val(), "cariKod", cariHareket);
  let cariHareketNextCode = autoKod(cariHareketEntries[cariHareketEntries.length - 1].no, "no", cariHareket);
  let cariIndex = getIndex($("#fatura-no-input").val(), "faturaNo", cariHareket);
  let newCariHareket = {
    id: cariHareket[cariHareket.length - 1].id + 1,
    no: cariHareketNextCode,
    cariKod: $("#fatura-cari-kod-input").val(),
    tarih: new Date($("#fatura-tarih-input").datepicker("getDate").getTime()).toJSON(),
    islemTuru: "Fatura",
    faturaNo: $("#fatura-no-input").val(),
    makbuzNo: "",
    hareketTipi: faturaTipi,
    borc: faturaTipi == "Satış Faturası" ? +currencyReverseFormatter($("#fatura-genel-toplam-input").val()) : 0,
    alacak: faturaTipi == "Alış Faturası" ? +currencyReverseFormatter($("#fatura-genel-toplam-input").val()) : 0,
  };
  if (cariIndex < 0) {
    addData(newCariHareket, "no", cariHareket);
  } else {
    let oldCariHareketNo = cariHareket[cariIndex].no;
    cariHareket[cariIndex] = newCariHareket;
    cariHareket[cariIndex].no = oldCariHareketNo;
  }
};

const faturaFaturaKalemEkle = () => {
  faturaKalemCurrent = [];
  let faturaKalemRows = $(".fatura-kalem-table-body tr");
  for (let i = 0; i < faturaKalemRows.length - 1; i++) {
    faturaKalemCurrent.push({
      id: +faturaKalemRows[i].dataset.id,
      faturaNo: $("#fatura-no-input").val(),
      stokKodu: faturaKalemRows[i].children[0].children[0].value,
      miktar: +faturaKalemRows[i].children[2].children[0].value,
      birim: faturaKalemRows[i].children[3].children[0].value,
      fiyat: +currencyReverseFormatter(faturaKalemRows[i].children[4].children[0].value),
      tutar: +currencyReverseFormatter(faturaKalemRows[i].children[5].children[0].value),
    });
  }
  let faturaKalemItemsToTakeOut = faturaKalemReference.filter((item) => item != getData(item.id, "id", faturaKalemCurrent));
  faturaKalemItemsToTakeOut.forEach((item) => deleteWithoutConfirmation(item.id, "id", faturaKalem));
  let faturaKalemItemsToPutIn = faturaKalemCurrent.filter((item) => item != getData(item.id, "id", faturaKalemReference));
  faturaKalemItemsToPutIn.forEach((item) => addData(item, "id", faturaKalem));
};

const faturaStokHareketEkle = () => {
  let stokHareketItemsToTakeOut = [];
  faturaKalemReference.forEach((item) => {
    stokHareketItemsToTakeOut.push(stokHareket.filter((data) => data.faturaNo == item.faturaNo)[0]);
  });
  stokHareketItemsToTakeOut.forEach((item) => {
    if (item) {
      deleteWithoutConfirmation(item.no, "no", stokHareket);
    }
  });

  faturaKalemCurrent.forEach((item) => {
    let hareketNo = getData(item.stokKodu, "stokKodu", stokHareket) ? getData(item.stokKodu, "stokKodu", stokHareket).no : "";
    let stokHareketNextCode = autoKod(hareketNo, "no", stokHareket);
    addData(
      {
        id: stokHareket[stokHareket.length - 1].id + 1,
        no: stokHareketNextCode,
        stokKodu: item.stokKodu,
        faturaNo: item.faturaNo,
        hareketTipi: faturaTipi,
        tarih: new Date($("#fatura-tarih-input").datepicker("getDate").getTime()).toJSON(),
        girenMiktar: faturaTipi == "Alış Faturası" ? item.miktar : 0,
        cikanMiktar: faturaTipi == "Satış Faturası" ? item.miktar : 0,
        birim: item.birim,
        girenFiyat: faturaTipi == "Alış Faturası" ? item.fiyat : 0,
        cikanFiyat: faturaTipi == "Satış Faturası" ? item.fiyat : 0,
        girenTutar: faturaTipi == "Alış Faturası" ? item.tutar : 0,
        cikanTutar: faturaTipi == "Satış Faturası" ? item.tutar : 0,
      },
      "no",
      stokHareket
    );
  });
};

const faturaDelete = (e) => {
  let faturaNo = e.target.dataset.faturaNo;

  let faturaKalemItemsToDelete = faturaKalem.filter((item) => item.faturaNo == faturaNo);
  faturaKalemItemsToDelete.forEach((item) => deleteWithoutConfirmation(item.id, "id", faturaKalem));

  let stokHareketItemsToDelete = stokHareket.filter((item) => item.faturaNo == faturaNo);
  stokHareketItemsToDelete.forEach((item) => deleteWithoutConfirmation(item.no, "no", stokHareket));

  deleteWithoutConfirmation(faturaNo, "faturaNo", cariHareket);

  deleteData(faturaNo, "no", fatura);

  menuFaturaUi();
};
