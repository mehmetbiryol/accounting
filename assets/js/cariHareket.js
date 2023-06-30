const menuCariHareketUi = () => {
  $("#app-screen").html("");
  $("#app-screen").append(`<h1 class="text-center">Cari Hareketler</h1>
          <div class="filter-container d-flex justify-content-center my-3">
            <input class="w-100 px-2" type="text" id="cari-hareket-filter" name="cari-hareket-filter" placeholder="Filtrele"/>
            <button onclick="cariHareketFiltre()" class="btn btn-primary ms-2" id="cari-hareket-filter-btn">Filtrele</button>
          </div>
          <div class="cari-hareket-screen">
            <div class="table-add-container d-flex justify-content-end">
              <button id="cari-hareket-add-btn" onclick="cariHareketDuzenle(event)" type="button" class="btn btn-success addBtn">Ekle</button>
            </div>
            <table class="table table-hover">
              <thead>
                <tr>
                  <th scope="col" onclick="sortTableCariHareket(event)" data-sort-order="original" data-sort-by="no">Hareket Kodu</th>
                  <th scope="col" onclick="sortTableCariHareket(event)" data-sort-order="original" data-sort-by="cariKod">Cari Kod</th>
                  <th scope="col">Ticari Ünvan</th>
                  <th scope="col" onclick="sortTableCariHareket(event)" data-sort-order="original" data-sort-by="tarih">Tarih</th>
                  <th scope="col" onclick="sortTableCariHareket(event)" data-sort-order="original" data-sort-by="islemTuru">İşlem Türü</th>
                  <th scope="col" onclick="sortTableCariHareket(event)" data-sort-order="original" data-sort-by="faturaNo">Fatura No</th>
                  <th scope="col" onclick="sortTableCariHareket(event)" data-sort-order="original" data-sort-by="makbuzNo">Makbuz No</th>
                  <th scope="col" onclick="sortTableCariHareket(event)" data-sort-order="original" data-sort-by="hareketTipi">Hareket Tipi</th>
                  <th scope="col" onclick="sortTableCariHareket(event)" data-sort-order="original" data-sort-by="borc">Borç</th>
                  <th scope="col" onclick="sortTableCariHareket(event)" data-sort-order="original" data-sort-by="alacak">Alacak</th>
                </tr>
              </thead>
              <tbody class="cari-hareket-table-body">                
              </tbody>
            </table>
          </div>`);
  cariHareketTableFill(cariHareket);
};

$("#menu-cari-hareket-btn").on("click", menuCariHareketUi);

const sortTableCariHareket = (e) => {
  cariHareketTableFill(sortTable(e, cariHareket));
};

const cariHareketTableFill = (source) => {
  $(".cari-hareket-table-body").html("");
  source.map((item) =>
    $(".cari-hareket-table-body").append(`<tr onclick="cariHareketDuzenle(event)" data-kod="${item.no}">
                  <td>${item.no}</td>
                  <td>${item.cariKod}</td>
                  <td>${getData(item.cariKod, "kod", cariTanim).ticariUnvan}</td>
                  <td>${dateFormatter.format(new Date(item.tarih))}</td>
                  <td>${item.islemTuru}</td>
                  <td>${item.faturaNo}</td>
                  <td>${item.makbuzNo}</td>
                  <td>${item.hareketTipi}</td>
                  <td>${currencyFormatter.format(item.borc)}</td>
                  <td>${currencyFormatter.format(item.alacak)}</td>
                </tr>`)
  );
};

const cariHareketDuzenle = (e) => {
  let currentData = getData($(e.target).parents("tr").data("kod"), "no", cariHareket);
  let data =
    currentData != null
      ? currentData
      : {
          id: cariHareket.length ? cariHareket[cariHareket.length - 1].id + 1 : 1,
          no: "",
          cariKod: "",
          tarih: Date.now(),
          islemTuru: "",
          faturaNo: "",
          makbuzNo: "",
          hareketTipi: "Genel Hareket",
          borc: 0,
          alacak: 0,
        };
  cariHareketInputFill(data);
};

const cariHareketInputFill = (data) => {
  $("#app-screen").html("");
  $("#app-screen").append(`<div class="cari-hareket-ekle-screen">
            <h1 class="text-center">Cari Hareket Düzenle</h1>
            <div class="d-flex w-25 justify-content-between mt-5">
              <label for="cari-hareket-id-input">Id:</label>
              <input type="number" id="cari-hareket-id-input" name="cari-hareket-id-input" readonly value="${data.id}"/>
            </div>
            <div class="d-flex w-25 justify-content-between mt-2 position-relative">
              <label for="cari-hareket-kod-input">Hareket Kodu: <sup>*</sup></label>
              <input type="text" autofocus onchange="cariHareketInputFillByNo(event)" id="cari-hareket-kod-input" name="cari-hareket-kod-input" value="${
                data.no
              }" title="Tabloyu doldurmak için kodu girip Enter'a basın. Yeni bir kod için alt+Enter(option+Enter for Mac)'a basın"/>
              <button onclick="cariHareketAutoKod()" class="cari-hareket-autokod-btn btn btn-primary">Auto Kod</button>
            </div>
            <div class="d-flex w-25 justify-content-between mt-2">
              <label for="cari-hareket-cari-kod-input">Cari Kod: <sup>*</sup></label>
              <input type="text" onchange="cariHareketInputFillByKod(event)" id="cari-hareket-cari-kod-input" name="cari-hareket-cari-kod-input" value="${data.cariKod}"/>
            </div>
            <div class="d-flex w-25 justify-content-between mt-2">
              <label for="cari-hareket-ticari-unvan-input">Ticari Ünvan:</label>
              <input type="text" id="cari-hareket-ticari-unvan-input" name="cari-hareket-ticari-unvan-input" readonly value="${
                data.cariKod == "" ? "" : getData(data.cariKod, "kod", cariTanim).ticariUnvan
              }"/>
            </div>
            <div class="d-flex w-25 justify-content-between mt-2">
              <label for="cari-hareket-tarih-input">Tarih: <sup>*</sup></label>
              <input type="text" id="cari-hareket-tarih-input" name="cari-hareket-tarih-input" value="${dateFormatter.format(new Date(data.tarih))}"/>
            </div>
            <div class="d-flex w-25 justify-content-between mt-2">
              <label for="cari-hareket-islem-turu-input">İşlem Türü: <sup>*</sup></label>
              <input type="text" id="cari-hareket-islem-turu-input" name="cari-hareket-islem-turu-input" value="${data.islemTuru}"/>
            </div>
            <div class="d-flex w-25 justify-content-between mt-2">
              <label for="cari-hareket-fatura-no-input">Fatura No: <sup>*</sup></label>
              <input type="text" id="cari-hareket-fatura-no-input" name="cari-hareket-fatura-no-input" readonly value="${data.faturaNo}"/>
            </div>
            <div class="d-flex w-25 justify-content-between mt-2">
              <label for="cari-hareket-makbuz-no-input">Makbuz No: <sup>*</sup></label>
              <input type="text" id="cari-hareket-makbuz-no-input" name="cari-hareket-makbuz-no-input" readonly value="${data.makbuzNo}"/>
            </div>
            <div class="d-flex w-25 justify-content-between mt-2">
              <label for="cari-hareket-hareket-tipi-input">Hareket Tipi: <sup>*</sup></label>
              <input type="text" id="cari-hareket-hareket-tipi-input" name="cari-hareket-hareket-tipi-input" readonly value="${data.hareketTipi}"/>
            </div>
            <div class="d-flex w-25 justify-content-between mt-2">
              <label for="cari-hareket-borc-input">Borç: <sup>*</sup></label>
              <input type="text" onfocusin="currencyInputReverseFormatter(event)" onfocusout="currencyInputFormatter(event)" id="cari-hareket-borc-input" name="cari-hareket-borc-input" value="${currencyFormatter.format(
                data.borc
              )}"/>
            </div>
            <div class="d-flex w-25 justify-content-between mt-2">
              <label for="cari-hareket-alacak-input">Alacak: <sup>*</sup></label>
              <input type="text" onfocusin="currencyInputReverseFormatter(event)" onfocusout="currencyInputFormatter(event)" id="cari-hareket-alacak-input" name="cari-hareket-alacak-input" value="${currencyFormatter.format(
                data.alacak
              )}"/>
            </div>
            <div class="d-flex w-25 justify-content-end mt-3 gap-2">
              <button type="button" onclick="menuCariHareketUi()" class="btn btn-warning cancelBtn">İptal</button>
              <button data-kod="${data.no}" onclick="cariHareketDelete(event)" type="button" class="btn btn-danger deleteBtn">Sil</button>
              <button id="cari-hareket-kaydet" type="button" onclick="cariHareketKaydetBtn()" class="btn btn-success">Kaydet</button>
            </div>
          </div>`);
  //$("#cari-hareket-kaydet").on("click", cariHareketKaydetBtn);
  //$(".cari-hareket-autokod-btn").on("click", cariHareketAutoKod);
  //$(".deleteBtn").on("click", cariHareketDelete);
  //$(".cancelBtn").on("click", menuCariHareketUi);
  $("#cari-hareket-tarih-input").datepicker({ dateFormat: "dd/mm/yy" });
  // $("#cari-hareket-borc-input").focusin(currencyInputReverseFormatter);
  // $("#cari-hareket-borc-input").focusout(currencyInputFormatter);
  // $("#cari-hareket-alacak-input").focusin(currencyInputReverseFormatter);
  // $("#cari-hareket-alacak-input").focusout(currencyInputFormatter);
  //$("#cari-hareket-kod-input").on("change", cariHareketInputFillByNo);
  //$("#cari-hareket-cari-kod-input").on("change", cariHareketInputFillByKod);
  //$("#cari-hareket-kod-input").tooltip();
};

const cariHareketInputFillByNo = (e) => {
  let data = getData(e.target.value, "no", cariHareket);
  if (data != null) {
    $(".tooltip").remove();
    cariHareketInputFill(data);
  }
};

const cariHareketInputFillByKod = (e) => {
  let value = e.target.value;
  let data = getData(value, "kod", cariTanim);
  $("#cari-hareket-ticari-unvan-input").val(data.ticariUnvan);
};

const cariHareketAutoKod = () => {
  $("#cari-hareket-kod-input").val(autoKod($("#cari-hareket-kod-input").val(), "no", cariHareket));
};

const cariHareketKaydetBtn = () => {
  if (!$("#cari-hareket-fatura-no-input").val() && !$("#cari-hareket-makbuz-no-input").val()) {
    if (
      $("#cari-hareket-kod-input").val() &&
      $("#cari-hareket-cari-kod-input").val() &&
      $("#cari-hareket-tarih-input").val() &&
      $("#cari-hareket-islem-turu-input").val() &&
      typeof +$("#cari-hareket-borc-input").val() == "number" &&
      typeof +$("#cari-hareket-alacak-input").val() == "number"
    ) {
      if (getIndex($("#cari-hareket-cari-kod-input").val(), "kod", cariTanim) > -1) {
        addData(
          {
            id: +$("#cari-hareket-id-input").val(),
            no: $("#cari-hareket-kod-input").val(),
            cariKod: $("#cari-hareket-cari-kod-input").val(),
            tarih: new Date($("#cari-hareket-tarih-input").datepicker("getDate").getTime()).toJSON(),
            islemTuru: $("#cari-hareket-islem-turu-input").val(),
            faturaNo: $("#cari-hareket-fatura-no-input").val(),
            makbuzNo: $("#cari-hareket-makbuz-no-input").val(),
            hareketTipi: $("#cari-hareket-hareket-tipi-input").val(),
            borc: +currencyReverseFormatter($("#cari-hareket-borc-input").val()),
            alacak: +currencyReverseFormatter($("#cari-hareket-alacak-input").val()),
          },
          "no",
          cariHareket
        );
        menuCariHareketUi();
      } else {
        alert("Bu cari koda sahip bir cari tanım bulunamadı!");
      }
    } else {
      alert("Lütfen gerekli alanları doldurunuz!");
    }
  } else {
    alert("Lütfen bu veriyi bağlı olduğu fatura yada makbuzdan düzenleyiniz!");
  }
};

const cariHareketFiltre = () => {
  $(".cari-hareket-table-body").html("");
  let filteredItems = searchData($("#cari-hareket-filter").val(), cariHareket);
  cariHareketTableFill(filteredItems);
  //$(".cari-hareket-table-body tr").on("click", cariHareketDuzenle);
};

const cariHareketDelete = (e) => {
  if ($("#cari-hareket-fatura-no-input").val() == "" && $("#cari-hareket-makbuz-no-input").val() == "") {
    deleteData(e.target.dataset.kod, "no", cariHareket);
    saveToStorageAll();
    menuCariHareketUi();
  } else {
    alert("Lütfen bu veriyi bağlı olduğu fatura yada makbuzdan düzenleyiniz!");
  }
};
