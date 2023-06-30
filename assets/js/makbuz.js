let makbuzTipi;
let makbuzKalemCurrent;

const menuMakbuzUi = () => {
  $("#app-screen").html("");
  $("#app-screen").append(`<h1 class="text-center">Makbuzlar</h1>
          <div class="filter-container d-flex justify-content-center my-3">
            <input class="w-100 px-2" type="text" id="makbuz-filter" name="makbuz-filter" placeholder="Filtrele"/>
            <button onclick="makbuzFiltre()" class="btn btn-primary ms-2" id="makbuz-filter-btn">Filtrele</button>
          </div>
          <div class="makbuz-screen">
            <div class="table-add-container d-flex justify-content-end gap-2">
              <button type="button" onclick="makbuzDuzenle(event)" class="btn btn-primary tahsilEkle">Tahsil Makbuzu Ekle</button>
              <button type="button" onclick="makbuzDuzenle(event)" class="btn btn-success tediyeEkle">Tediye Makbuzu Ekle</button>
            </div>
            <table class="table table-hover">
              <thead>
                <tr>
                  <th scope="col" onclick="sortTableMakbuz(event)" data-sort-order="original" data-sort-by="no">Makbuz No</th>
                  <th scope="col" onclick="sortTableMakbuz(event)" data-sort-order="original" data-sort-by="cariKod">Cari Kod</th>
                  <th scope="col" onclick="sortTableMakbuz(event)" data-sort-order="original" data-sort-by="tarih">Tarih</th>
                  <th scope="col" onclick="sortTableMakbuz(event)" data-sort-order="original" data-sort-by="toplamTutar">Toplam tutar</th>
                  <th scope="col" onclick="sortTableMakbuz(event)" data-sort-order="original" data-sort-by="makbuzTipi">Makbuz Tipi</th>
                </tr>
              </thead>
              <tbody class="makbuz-table-body">
              </tbody>
            </table>
          </div>`);
  makbuzTableFill(makbuz);
};

$("#menu-makbuz-btn").on("click", menuMakbuzUi);

const makbuzTableFill = (source) => {
  $(".makbuz-table-body").html("");
  source.map((item) =>
    $(".makbuz-table-body").append(`<tr onclick="makbuzDuzenle(event)" data-kod="${item.no}">
                  <td>${item.no}</td>
                  <td>${item.cariKod}</td>
                  <td>${dateFormatter.format(new Date(item.tarih))}</td>
                  <td>${currencyFormatter.format(item.toplamTutar)}</td>
                  <td>${item.makbuzTipi}</td>
                </tr>`)
  );
};

const sortTableMakbuz = (e) => {
  makbuzTableFill(sortTable(e, makbuz));
};

const makbuzFiltre = () => {
  $(".makbuz-table-body").html("");
  let filteredItems = searchData($("#makbuz-filter").val(), makbuz);
  makbuzTableFill(filteredItems);
};

const makbuzDuzenle = (e) => {
  if (e.target.classList.contains("tahsilEkle")) {
    makbuzTipi = "Tahsil Makbuzu";
  } else if (e.target.classList.contains("tediyeEkle")) {
    makbuzTipi = "Tediye Makbuzu";
  }
  let currentData = getData($(e.target).parents("tr").data("kod"), "no", makbuz);
  let data =
    currentData != null
      ? currentData
      : {
          id: makbuz.length ? makbuz[makbuz.length - 1].id + 1 : 1,
          no: "",
          cariKod: "",
          tarih: Date.now(),
          toplamTutar: 0,
          makbuzTipi: makbuzTipi,
        };
  makbuzInputFill(data);
};

const makbuzInputFill = (data) => {
  $("#app-screen").html("");
  $("#app-screen").append(`<div class="row">
          <div class="makbuz-ekle-screen-top row justify-content-between px-5">
            <h1 class="text-center">Makbuz Düzenle</h1>
            <div class="d-flex justify-content-between mt-4 col-5 position-relative makbuz-no-container">
              <label for="makbuz-no-input">Makbuz No: <sup>*</sup></label>
              <input type="text" autofocus onchange="makbuzInputFillByNo(event)" id="makbuz-no-input" name="makbuz-no-input" value="${data.no}"/>
            </div>
            <div class="d-flex justify-content-between mt-4 col-5">
              <label for="makbuz-cari-kod-input">Cari Kod: <sup>*</sup></label>
              <input type="text" onchange="makbuzInputFillByCariKod(event)" id="makbuz-cari-kod-input" name="makbuz-cari-kod-input" value="${data.cariKod}"/>
            </div>
            <div class="d-flex justify-content-between mt-2 col-5">
              <label for="makbuz-tarih-input">Tarih: <sup>*</sup></label>
              <input type="text" id="makbuz-tarih-input" name="makbuz-tarih-input" value="${dateFormatter.format(new Date(data.tarih))}"/>
            </div>
            <div class="d-flex justify-content-between mt-2 col-5">
              <label for="makbuz-ticari-unvan-input">Ticari Ünvan: <sup>*</sup></label>
              <input type="text" id="makbuz-ticari-unvan-input" name="makbuz-ticari-unvan-input" value="${data.cariKod != "" ? getData(data.cariKod, "kod", cariTanim).ticariUnvan : ""}"/>
            </div>
          </div>
        </div>
        <div class="row mt-5 mx-3 makbuz-kalem-ekle-screen">
        </div>`);
  if (data.makbuzTipi == "Tahsil Makbuzu") {
    console.log("tahsil");
    makbuzTipi = "Tahsil Makbuzu";
    $(".makbuz-no-container").append(`<button onclick="makbuzAutoKod()"  class="makbuz-autokod-btn btn btn-primary">Auto Kod</button>`);
  } else {
    makbuzTipi = "Tediye Makbuzu";
    console.log("tediye");
  }
  let currentKalemData = filterData(data.no, "makbuzNo", makbuzKalem);

  makbuzKalemTableFill(currentKalemData);

  $("#app-screen").append(`<div class="makbuz-ekle-screen-bottom mt-3 row justify-content-end">
          <div class="d-flex justify-content-end gap-4 mt-2 col-7 pe-5">
            <label for="makbuz-toplam-tutar-input">Toplam Tutar: <sup>*</sup></label>
            <input type="text" onfocusin="currencyInputReverseFormatter(event)" onfocusout="currencyInputFormatter(event)" id="makbuz-toplam-tutar-input" name="makbuz-toplam-tutar-input" value="${currencyFormatter.format(
              data.toplamTutar
            )}"/>
          </div>
          <div class="d-flex justify-content-end mt-3 col-7 gap-2 pe-5">
            <button type="button" onclick="menuMakbuzUi()" class="btn btn-warning cancelBtn">İptal</button>
            <button data-makbuz-no="${data.no}" onclick="makbuzDelete(event)" type="button" class="btn btn-danger deleteBtn">Sil</button>
            <button id="makbuz-kaydet" onclick="makbuzKaydetBtn()" type="button" class="btn btn-success">Kaydet</button>
          </div>
        </div>`);
  makbuzTotals();
  $("#makbuz-tarih-input").datepicker({ dateFormat: "dd/mm/yy" });
};

const makbuzAutoKod = () => {
  $("#makbuz-no-input").val(autoKod($("#makbuz-no-input").val(), "no", makbuz));
};

const makbuzInputFillByCariKod = () => $("#makbuz-ticari-unvan-input").val($("#makbuz-cari-kod-input").val() != "" ? getData($("#makbuz-cari-kod-input").val(), "kod", cariTanim).ticariUnvan : "");

const makbuzInputFillByNo = (e) => {
  let data = getData(e.target.value, "no", makbuz);
  if (data != null) {
    makbuzInputFill(data);
  }
};

const makbuzKaydetBtn = () => {
  if (
    $("#makbuz-no-input").val() &&
    $("#makbuz-cari-kod-input").val() &&
    $("#makbuz-tarih-input").val()
    //check inputs more
  ) {
    if (getIndex($("#makbuz-cari-kod-input").val(), "kod", cariTanim) > -1) {
      makbuzEkle();
      makbuzCariHareketEkle();
      makbuzMakbuzKalemEkle();
      makbuzKasaHareketEkle();
      menuMakbuzUi();
    } else {
      alert("Bu cari koda sahip bir cari tanım bulunamadı!");
    }
  } else {
    alert("Lütfen gerekli alanları doldurunuz!");
  }
};

const makbuzEkle = () => {
  addData(
    {
      id: makbuz.length ? makbuz[makbuz.length - 1].id + 1 : 1,
      no: $("#makbuz-no-input").val(),
      cariKod: $("#makbuz-cari-kod-input").val(),
      tarih: new Date($("#makbuz-tarih-input").datepicker("getDate").getTime()).toJSON(),
      toplamTutar: +currencyReverseFormatter($("#makbuz-toplam-tutar-input").val()),
      makbuzTipi: makbuzTipi,
    },
    "no",
    makbuz
  );
};

const makbuzCariHareketEkle = () => {
  let cariHareketEntries = filterData($("#makbuz-cari-kod-input").val(), "cariKod", cariHareket);
  let cariHareketNextCode = autoKod(cariHareketEntries[cariHareketEntries.length - 1].no, "no", cariHareket);
  let cariIndex = getIndex($("#makbuz-no-input").val(), "makbuzNo", cariHareket);
  let newCariHareket = {
    id: cariHareket[cariHareket.length - 1].id + 1,
    no: cariHareketNextCode,
    cariKod: $("#makbuz-cari-kod-input").val(),
    tarih: new Date($("#makbuz-tarih-input").datepicker("getDate").getTime()).toJSON(),
    islemTuru: "Makbuz",
    faturaNo: "",
    makbuzNo: $("#makbuz-no-input").val(),
    hareketTipi: makbuzTipi,
    borc: makbuzTipi == "Tahsil Makbuzu" ? +currencyReverseFormatter($("#makbuz-toplam-tutar-input").val()) : 0,
    alacak: makbuzTipi == "Tediye Makbuzu" ? +currencyReverseFormatter($("#makbuz-toplam-tutar-input").val()) : 0,
  };
  if (cariIndex < 0) {
    addData(newCariHareket, "no", cariHareket);
  } else {
    let oldCariHareketNo = cariHareket[cariIndex].no;
    cariHareket[cariIndex] = newCariHareket;
    cariHareket[cariIndex].no = oldCariHareketNo;
  }
};

const makbuzMakbuzKalemEkle = () => {
  makbuzKalemCurrent = [];
  let makbuzKalemRows = $(".makbuz-kalem-table-body tr");
  for (let i = 0; i < makbuzKalemRows.length - 1; i++) {
    makbuzKalemCurrent.push({
      id: +makbuzKalemRows[i].dataset.id,
      makbuzNo: $("#makbuz-no-input").val(),
      kasaKodu: makbuzKalemRows[i].children[0].children[0].value,
      islemTuru: makbuzKalemRows[i].children[2].children[0].value,
      tutar: +currencyReverseFormatter(makbuzKalemRows[i].children[3].children[0].value),
    });
  }
  let makbuzKalemItemsToTakeOut = makbuzKalemReference.filter((item) => item != getData(item.id, "id", makbuzKalemCurrent));
  makbuzKalemItemsToTakeOut.forEach((item) => deleteWithoutConfirmation(item.id, "id", makbuzKalem));
  let makbuzKalemItemsToPutIn = makbuzKalemCurrent.filter((item) => item != getData(item.id, "id", makbuzKalemReference));
  makbuzKalemItemsToPutIn.forEach((item) => addData(item, "id", makbuzKalem));
};

const makbuzKasaHareketEkle = () => {
  let kasaHareketItemsToTakeOut = [];
  makbuzKalemReference.forEach((item) => {
    kasaHareketItemsToTakeOut.push(kasaHareket.filter((data) => data.makbuzNo == item.makbuzNo && (data.gelir == item.tutar || data.gider == item.tutar) && data.islemTuru == item.islemTuru)[0]);
  });
  kasaHareketItemsToTakeOut.forEach((item) => {
    if (item) {
      deleteWithoutConfirmation(item.no, "no", kasaHareket);
    }
  });

  makbuzKalemCurrent.forEach((item) => {
    let kasaHareketNextCode = autoKod(getData(item.kasaKodu, "kasaKodu", kasaHareket).no, "no", kasaHareket);
    addData(
      {
        id: kasaHareket[kasaHareket.length - 1].id + 1,
        no: kasaHareketNextCode,
        kasaKodu: item.kasaKodu,
        makbuzNo: item.makbuzNo,
        hareketTipi: makbuzTipi,
        tarih: new Date($("#makbuz-tarih-input").datepicker("getDate").getTime()).toJSON(),
        gelir: makbuzTipi == "Tahsil Makbuzu" ? item.tutar : 0,
        gider: makbuzTipi == "Tediye Makbuzu" ? item.tutar : 0,
        islemTuru: item.islemTuru,
      },
      "no",
      kasaHareket
    );
  });
};

const makbuzDelete = (e) => {
  let makbuzNo = e.target.dataset.makbuzNo;

  let makbuzKalemItemsToDelete = makbuzKalem.filter((item) => item.makbuzNo == makbuzNo);
  makbuzKalemItemsToDelete.forEach((item) => deleteWithoutConfirmation(item.id, "id", makbuzKalem));

  let kasaHareketItemsToDelete = kasaHareket.filter((item) => item.makbuzNo == makbuzNo);
  kasaHareketItemsToDelete.forEach((item) => deleteWithoutConfirmation(item.no, "no", kasaHareket));

  deleteWithoutConfirmation(makbuzNo, "makbuzNo", cariHareket);

  deleteData(makbuzNo, "no", makbuz);

  menuMakbuzUi();
};
