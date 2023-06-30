const menuKasaHareketUi = () => {
  $("#app-screen").html("");
  $("#app-screen").append(`<h1 class="text-center">Kasa Hareketleri</h1>
          <div class="filter-container d-flex justify-content-center my-3">
            <input class="w-100 px-2" type="text" id="kasa-hareket-filter" name="kasa-hareket-filter" placeholder="Filtrele" />
            <button class="btn btn-primary ms-2" onclick="kasaHareketFiltre()" id="kasa-hareket-filter-btn">Filtrele</button>
          </div>
          <div class="kasa-hareket-screen">
            <div class="table-add-container d-flex justify-content-end">
              <button type="button" onclick="kasaHareketDuzenle(event)" class="btn btn-success addBtn">Ekle</button>
            </div>
            <table class="table table-hover">
              <thead>
                <tr>
                  <th scope="col" onclick="sortTableKasaHareket(event)" data-sort-order="original" data-sort-by="no">Hareket Kodu</th>
                  <th scope="col" onclick="sortTableKasaHareket(event)" data-sort-order="original" data-sort-by="kasaKodu">Kasa Kodu</th>
                  <th scope="col">Kasa Adı</th>
                  <th scope="col" onclick="sortTableKasaHareket(event)" data-sort-order="original" data-sort-by="makbuzNo">Makbuz No</th>
                  <th scope="col" onclick="sortTableKasaHareket(event)" data-sort-order="original" data-sort-by="hareketTipi">Hareket Tipi</th>
                  <th scope="col" onclick="sortTableKasaHareket(event)" data-sort-order="original" data-sort-by="tarih">Tarih</th>
                  <th scope="col" onclick="sortTableKasaHareket(event)" data-sort-order="original" data-sort-by="gelir">Gelir</th>
                  <th scope="col" onclick="sortTableKasaHareket(event)" data-sort-order="original" data-sort-by="gider">Gider</th>
                  <th scope="col" onclick="sortTableKasaHareket(event)" data-sort-order="original" data-sort-by="islemTuru">İşlem Türü</th>
                </tr>
              </thead>
              <tbody class="kasa-hareket-table-body">
              </tbody>
            </table>
          </div>`);
  kasaHareketTableFill(kasaHareket);
};

$("#menu-kasa-hareket-btn").on("click", menuKasaHareketUi);

const sortTableKasaHareket = (e) => {
  kasaHareketTableFill(sortTable(e, kasaHareket));
};

const kasaHareketTableFill = (source) => {
  $(".kasa-hareket-table-body").html("");
  source.map((item) =>
    $(".kasa-hareket-table-body").append(`<tr onclick="kasaHareketDuzenle(event)" data-kod="${item.no}">
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

const kasaHareketDuzenle = (e) => {
  let currentData = getData($(e.target).parents("tr").data("kod"), "no", kasaHareket);
  let data =
    currentData != null
      ? currentData
      : {
          id: kasaHareket.length ? kasaHareket[kasaHareket.length - 1].id + 1 : 1,
          no: "",
          kasaKodu: "",
          makbuzNo: "",
          hareketTipi: "",
          tarih: Date.now(),
          gelir: 0,
          gider: 0,
          islemTuru: "",
        };
  kasaHareketInputFill(data);
};

const kasaHareketInputFill = (data) => {
  $("#app-screen").html("");
  $("#app-screen").append(`<div class="kasa-hareket-ekle-screen">
      <h1 class="text-center">Kasa Hareket Düzenle</h1>
      <div class="d-flex w-25 justify-content-between mt-5">
        <label for="kasa-hareket-id-input">Id:</label>
        <input type="text" id="kasa-hareket-id-input" name="kasa-hareket-id-input" readonly value="${data.id}"/>
      </div>
      <div class="d-flex w-25 justify-content-between mt-2 position-relative">
        <label for="kasa-hareket-kod-input">Hareket Kodu: <sup>*</sup></label>
        <input type="text" autofocus onchange="kasaHareketInputFillByNo(event)" id="kasa-hareket-kod-input" name="kasa-hareket-kod-input" value="${
          data.no
        }" title="Tabloyu doldurmak için kodu girip Enter'a basın. Yeni bir kod için alt+Enter(option+Enter for Mac)'a basın"/>
        <button onclick="kasaHareketAutoKod()" class="kasa-hareket-autokod-btn btn btn-primary">Auto Kod</button>
      </div>
      <div class="d-flex w-25 justify-content-between mt-2">
        <label for="kasa-hareket-kasa-kod-input">Kasa Kodu: <sup>*</sup></label>
        <input type="text" onchange="kasaHareketInputFillByKod(event)" id="kasa-hareket-kasa-kod-input" name="kasa-hareket-kasa-kod-input" value="${data.kasaKodu}"/>
      </div>
      <div class="d-flex w-25 justify-content-between mt-2">
        <label for="kasa-hareket-ad-input">Kasa Adı:</label>
        <input type="text" id="kasa-hareket-ad-input" name="kasa-hareket-ad-input" readonly value="${data.kasaKodu == "" ? "" : getData(data.kasaKodu, "kod", kasaTanim).ad}"/>
      </div>
      <div class="d-flex w-25 justify-content-between mt-2">
        <label for="kasa-hareket-makbuz-no-input">Makbuz No:</label>
        <input type="text" id="kasa-hareket-makbuz-no-input" name="kasa-hareket-makbuz-no-input" readonly value="${data.makbuzNo}"/>
      </div>
      <div class="d-flex w-25 justify-content-between mt-2">
        <label for="kasa-hareket-hareket-tipi-input">Hareket Tipi:</label>
        <input type="text" id="kasa-hareket-hareket-tipi-input" name="kasa-hareket-hareket-tipi-input" readonly value="${data.hareketTipi}"/>
      </div>
      <div class="d-flex w-25 justify-content-between mt-2">
        <label for="kasa-hareket-tarih-input">Tarih:</label>
        <input type="text" id="kasa-hareket-tarih-input" name="kasa-hareket-tarih-input" value="${dateFormatter.format(new Date(data.tarih))}"/>
      </div>
      <div class="d-flex w-25 justify-content-between mt-2">
        <label for="kasa-hareket-gelir-input">Gelir: <sup>*</sup></label>
        <input type="text" onfocusin="currencyInputReverseFormatter(event)" onfocusout="currencyInputFormatter(event)" id="kasa-hareket-gelir-input" name="kasa-hareket-gelir-input" value="${currencyFormatter.format(
          data.gelir
        )}"/>
      </div>
      <div class="d-flex w-25 justify-content-between mt-2">
        <label for="kasa-hareket-gider-input">Gider: <sup>*</sup></label>
        <input type="text" onfocusin="currencyInputReverseFormatter(event)" onfocusout="currencyInputFormatter(event)" id="kasa-hareket-gider-input" name="kasa-hareket-gider-input" value="${currencyFormatter.format(
          data.gider
        )}"/>
      </div>
      <div class="d-flex w-25 justify-content-between mt-2">
        <label for="kasa-hareket-islem-turu-input">İşlem Türü: <sup>*</sup></label>
        <input type="text" id="kasa-hareket-islem-turu-input" name="kasa-hareket-islem-turu-input" value="${data.islemTuru}"/>
      </div>
      <div class="d-flex w-25 justify-content-end mt-3 gap-2">
        <button type="button" onclick="menuKasaHareketUi()" class="btn btn-warning cancelBtn">İptal</button>
        <button data-kod="${data.no}" onclick="kasaHareketDelete(event)" type="button" class="btn btn-danger deleteBtn">Sil</button>
        <button id="kasa-hareket-kaydet" onclick="kasaHareketKaydetBtn()" type="button" class="btn btn-success">Kaydet</button>
      </div>
    </div>`);
  //$("#kasa-hareket-kaydet").on("click", kasaHareketKaydetBtn);
  //$(".kasa-hareket-autokod-btn").on("click", kasaHareketAutoKod);
  // $(".deleteBtn").on("click", kasaHareketDelete);
  // $(".cancelBtn").on("click", menuKasaHareketUi);
  $("#kasa-hareket-tarih-input").datepicker({ dateFormat: "dd/mm/yy" });
  //$("#kasa-hareket-kod-input").on("change", kasaHareketInputFillByNo);
  //$("#kasa-hareket-kasa-kod-input").on("change", kasaHareketInputFillByKod);
  //$("#kasa-hareket-kod-input").tooltip();
  // $("#kasa-hareket-gelir-input").focusin(currencyInputReverseFormatter);
  // $("#kasa-hareket-gelir-input").focusout(currencyInputFormatter);
  // $("#kasa-hareket-gider-input").focusin(currencyInputReverseFormatter);
  // $("#kasa-hareket-gider-input").focusout(currencyInputFormatter);
};

const kasaHareketInputFillByNo = (e) => {
  let data = getData(e.target.value, "no", kasaHareket);
  if (data != null) {
    $(".tooltip").remove();
    kasaHareketInputFill(data);
  }
};

const kasaHareketInputFillByKod = (e) => {
  let value = e.target.value;
  let data = getData(value, "kod", kasaTanim);
  $("#kasa-hareket-ad-input").val(data.ad);
};

const kasaHareketAutoKod = () => {
  $("#kasa-hareket-kod-input").val(autoKod($("#kasa-hareket-kod-input").val(), "no", kasaHareket));
};

const kasaHareketKaydetBtn = () => {
  if (!$("#kasa-hareket-makbuz-no-input").val()) {
    if (
      $("#kasa-hareket-kod-input").val() &&
      $("#kasa-hareket-kasa-kod-input").val() &&
      typeof +currencyReverseFormatter($("#kasa-hareket-gelir-input").val()) == "number" &&
      typeof +currencyReverseFormatter($("#kasa-hareket-gider-input").val()) == "number"
    ) {
      if (getIndex($("#kasa-hareket-kasa-kod-input").val(), "kod", kasaTanim) > -1) {
        addData(
          {
            id: +$("#kasa-hareket-id-input").val(),
            no: $("#kasa-hareket-kod-input").val(),
            kasaKodu: $("#kasa-hareket-kasa-kod-input").val(),
            makbuzNo: $("#kasa-hareket-makbuz-no-input").val(),
            hareketTipi: $("#kasa-hareket-hareket-tipi-input").val(),
            tarih: new Date($("#kasa-hareket-tarih-input").datepicker("getDate").getTime()).toJSON(),
            gelir: +currencyReverseFormatter($("#kasa-hareket-gelir-input").val()),
            gider: +currencyReverseFormatter($("#kasa-hareket-gider-input").val()),
            islemTuru: $("#kasa-hareket-islem-turu-input").val(),
          },
          "no",
          kasaHareket
        );
        menuKasaHareketUi();
      } else {
        alert("Bu kasa koduna sahip bir kasa tanımı bulunamadı!");
      }
    } else {
      alert("Lütfen gerekli alanları doldurunuz!");
    }
  } else {
    alert("Lütfen bu veriyi bağlı olduğu makbuz üzerinden düzenleyiniz!");
  }
};

const kasaHareketFiltre = () => {
  $(".kasa-hareket-table-body").html("");
  let filteredItems = searchData($("#kasa-hareket-filter").val(), kasaHareket);
  kasaHareketTableFill(filteredItems);
  //$(".kasa-hareket-table-body tr").on("click", kasaHareketDuzenle);
};

const kasaHareketDelete = (e) => {
  if (!$("#kasa-hareket-makbuz-no-input").val()) {
    deleteData(e.target.dataset.kod, "no", kasaHareket);
    saveToStorageAll();
    menuKasaHareketUi();
  } else {
    alert("Lütfen bu veriyi bağlı olduğu makbuz üzerinden düzenleyiniz!");
  }
};
