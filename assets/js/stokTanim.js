const menuStokTanimUi = () => {
  $("#app-screen").html("");
  $("#app-screen").append(`<h1 class="text-center">Stok Tanımları</h1>
          <div class="filter-container d-flex justify-content-center my-3">
            <input class="w-100 px-2" onclick="stokTanimFiltre()" type="text" id="stok-tanim-filter" name="stok-tanim-filter" placeholder="Filtrele"/>
            <button class="btn btn-primary ms-2" id="stok-tanim-filter-btn">Filtrele</button>
          </div>
          <div class="stok-tanim-screen">
            <div class="table-add-container d-flex justify-content-end">
              <button type="button" onclick="stokTanimDuzenle(event)" class="btn btn-success addBtn">Ekle</button>
            </div>
            <table class="table table-hover">
              <thead>
                <tr>
                  <th scope="col" onclick="sortTableStokTanim(event)" data-sort-order="original" data-sort-by="kod">Stok Kodu</th>
                  <th scope="col" onclick="sortTableStokTanim(event)" data-sort-order="original" data-sort-by="ad">Stok Adı</th>
                  <th scope="col" onclick="sortTableStokTanim(event)" data-sort-order="original" data-sort-by="fiyat">Fiyat</th>
                  <th scope="col" onclick="sortTableStokTanim(event)" data-sort-order="original" data-sort-by="kdv">KDV %</th>
                  <th scope="col" onclick="sortTableStokTanim(event)" data-sort-order="original" data-sort-by="birim">Birim</th>
                  <th scope="col" onclick="sortTableStokTanim(event)" data-sort-order="original" data-sort-by="kalan">Kalan</th>
                </tr>
              </thead>
              <tbody class="stok-tanim-table-body">
              </tbody>
            </table>
          </div>`);
  stokTanimTableFill(stokTanim);
  // $(".stok-tanim-table-body tr").on("click", stokTanimDuzenle);
  // $(".addBtn").on("click", stokTanimDuzenle);
  //$("#stok-tanim-filter-btn").on("click", stokTanimFiltre);
  //$("thead th").on("click", sortTableStokTanim);
};

$("#menu-stok-tanim-btn").on("click", menuStokTanimUi);

const sortTableStokTanim = (e) => {
  stokTanimTableFill(sortTable(e, stokTanim));
};

const stokTanimTableFill = (source) => {
  $(".stok-tanim-table-body").html("");
  source.map((item) =>
    $(".stok-tanim-table-body").append(`<tr onclick="stokTanimDuzenle(event)" data-kod="${item.kod}">
                  <td>${item.kod}</td>
                  <td>${item.ad}</td>
                  <td>${currencyFormatter.format(item.fiyat)}</td>
                  <td>${kdvFormatter.format(item.kdv)}</td>
                  <td>${item.birim}</td>
                  <td>${item.kalan}</td>
                </tr>`)
  );
};

const stokTanimDuzenle = (e) => {
  let currentData = getData($(e.target).parents("tr").data("kod"), "kod", stokTanim);
  let data =
    currentData != null
      ? currentData
      : {
          id: stokTanim.length ? stokTanim[stokTanim.length - 1].id + 1 : 1,
          kod: "",
          ad: "",
          fiyat: 0,
          kdv: 0,
          birim: "",
          kalan: "",
        };
  stokTanimInputFill(data);
};

const stokTanimInputFill = (data) => {
  $("#app-screen").html("");
  $("#app-screen").append(`<div class="stok-tanim-ekle-screen">
      <h1 class="text-center">Stok Tanım Düzenle</h1>
      <div class="d-flex w-25 justify-content-between mt-5">
        <label for="stok-tanim-id-input">Id:</label>
        <input type="text" id="stok-tanim-id-input" name="stok-tanim-id-input" readonly value="${data.id}"/>
      </div>
      <div class="d-flex w-25 justify-content-between mt-2 position-relative">
        <label for="stok-tanim-kod-input">Stok Kodu: <sup>*</sup></label>
        <input type="text" autofocus onchange="stokTanimInputFillByKod(event)" id="stok-tanim-kod-input" name="stok-tanim-kod-input" value="${
          data.kod
        }" title="Tabloyu doldurmak için kodu girip Enter'a basın. Yeni bir kod için alt+Enter(option+Enter for Mac)'a basın"/>
        <button onclick="stokTanimAutoKod()" class="stok-tanim-autokod-btn btn btn-primary">Auto Kod</button>
      </div>
      <div class="d-flex w-25 justify-content-between mt-2">
        <label for="stok-tanim-ad-input">Stok Adı: <sup>*</sup></label>
        <input type="text" id="stok-tanim-ad-input" name="stok-tanim-ad-input" value="${data.ad}"/>
      </div>
      <div class="d-flex w-25 justify-content-between mt-2">
        <label for="stok-tanim-fiyat-input">Fiyat: <sup>*</sup></label>
        <input type="text" onfocusin="currencyInputReverseFormatter(event)" onfocusout="currencyInputFormatter(event)" id="stok-tanim-fiyat-input" name="stok-tanim-fiyat-input" value="${currencyFormatter.format(
          data.fiyat
        )}"/>
      </div>
      <div class="d-flex w-25 justify-content-between mt-2">
        <label for="stok-tanim-kdv-input">Kdv: <sup>*</sup></label>
        <input type="text" id="stok-tanim-kdv-input" name="stok-tanim-kdv-input" value="${kdvFormatter.format(data.kdv)}"/>
      </div>
      <div class="d-flex w-25 justify-content-between mt-2">
        <label for="stok-tanim-birim-input">Birim: <sup>*</sup></label>
        <input type="text" id="stok-tanim-birim-input" name="stok-tanim-birim-input" value="${data.birim}"/>
      </div>
      <div class="d-flex w-25 justify-content-end mt-3 gap-2">
        <button type="button" onclick="menuStokTanimUi()" class="btn btn-warning cancelBtn">İptal</button>
        <button data-stok-kod="${data.kod}" onclick="stokTanimDelete(event)" type="button" class="btn btn-danger deleteBtn">Sil</button>
        <button id="stok-tanim-kaydet" onclick="stokTanimKaydetBtn()" type="button" class="btn btn-success">Kaydet</button>
      </div>
    </div>`);
  //$("#stok-tanim-kaydet").on("click", stokTanimKaydetBtn);
  //$(".stok-tanim-autokod-btn").on("click", stokTanimAutoKod);
  // $(".deleteBtn").on("click", stokTanimDelete);
  // $(".cancelBtn").on("click", menuStokTanimUi);
  // $("#stok-tanim-fiyat-input").focusin(currencyInputReverseFormatter);
  // $("#stok-tanim-fiyat-input").focusout(currencyInputFormatter);
  //$("#stok-tanim-kod-input").on("change", stokTanimInputFillByKod);
  //$("#stok-tanim-kod-input").tooltip();
};

const stokTanimInputFillByKod = (e) => {
  let data = getData(e.target.value, "kod", stokTanim);
  if (data != null) {
    $(".tooltip").remove();
    stokTanimInputFill(data);
  }
};

const stokTanimAutoKod = () => {
  $("#stok-tanim-kod-input").val(autoKod($("#stok-tanim-kod-input").val(), "kod", stokTanim));
};

const stokTanimKaydetBtn = () => {
  if (
    $("#stok-tanim-kod-input").val() &&
    $("#stok-tanim-ad-input").val() &&
    typeof +$("#stok-tanim-fiyat-input").val() == "number" &&
    +$("#stok-tanim-kdv-input").val() > 0 &&
    +$("#stok-tanim-kdv-input").val() < 100 &&
    $("#stok-tanim-birim-input").val()
  ) {
    addData(
      {
        id: +$("#stok-tanim-id-input").val(),
        kod: $("#stok-tanim-kod-input").val(),
        ad: $("#stok-tanim-ad-input").val(),
        fiyat: +currencyReverseFormatter($("#stok-tanim-fiyat-input").val()),
        kdv: +$("#stok-tanim-kdv-input").val(),
        birim: $("#stok-tanim-birim-input").val(),
        kalan: "kalan",
      },
      "kod",
      stokTanim
    );
    menuStokTanimUi();
  } else {
    alert("Lütfen gerekli alanları doldurunuz!");
  }
};

const stokTanimFiltre = () => {
  $(".stok-tanim-table-body").html("");
  let filteredItems = searchData($("#stok-tanim-filter").val(), stokTanim);
  stokTanimTableFill(filteredItems);
  //$(".stok-tanim-table-body tr").on("click", stokTanimDuzenle);
};

const stokTanimDelete = (e) => {
  deleteData(e.target.dataset.stokKod, "kod", stokTanim);
  menuStokTanimUi();
};
