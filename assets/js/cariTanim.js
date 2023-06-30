const menuCariTanimUi = () => {
  $("#app-screen").html("");
  $("#app-screen").append(`<h1 class="text-center">Cari Tanımlar</h1>
          <div class="filter-container d-flex justify-content-center my-3">
            <input class="w-100 px-2" type="text" id="cari-tanim-filter" name="cari-tanim-filter" placeholder="Filtrele"/>
            <button class="btn btn-primary ms-2" id="cari-tanim-filter-btn">Filtrele</button>
          </div>
          <div class="cari-tanim-screen">
            <div class="table-add-container d-flex justify-content-end">
              <button type="button" class="btn btn-success addBtn">Ekle</button>
            </div>
            <table class="table table-hover">
              <thead>
                <tr>
                  <th scope="col" data-sort-order="original" data-sort-by="kod">Cari Kod</th>
                  <th scope="col" data-sort-order="original" data-sort-by="ticariUnvan">Ticari Ünvan</th>
                  <th scope="col" data-sort-order="original" data-sort-by="yetkiliAd">Ad</th>
                  <th scope="col" data-sort-order="original" data-sort-by="yetkiliSoyad">Soyad</th>
                </tr>
              </thead>
              <tbody class="cari-tanim-table-body">
              </tbody>
            </table>
          </div>`);
  cariTanimTableFill(cariTanim);
  $(".cari-tanim-table-body tr").on("click", cariTanimDuzenle);
  $(".addBtn").on("click", cariTanimDuzenle);
  $("#cari-tanim-filter-btn").on("click", cariTanimFiltre);
  $("thead th").on("click", sortTableCariTanim);
};

const sortTableCariTanim = (e) => {
  cariTanimTableFill(sortTable(e, cariTanim));
};

$("#menu-cari-tanim-btn").on("click", menuCariTanimUi);

const cariTanimTableFill = (source) => {
  $(".cari-tanim-table-body").html("");
  source.map((item) =>
    $(".cari-tanim-table-body").append(`<tr data-kod="${item.kod}">
                  <td>${item.kod}</td>
                  <td>${item.ticariUnvan}</td>
                  <td>${item.yetkiliAd}</td>
                  <td>${item.yetkiliSoyad}</td>
                </tr>`)
  );
};

const cariTanimDuzenle = (e) => {
  let currentData = getData($(e.target).parents("tr").data("kod"), "kod", cariTanim);
  let data =
    currentData != null
      ? currentData
      : {
          id: cariTanim.length ? cariTanim[cariTanim.length - 1].id + 1 : 1,
          kod: "",
          ticariUnvan: "",
          yetkiliAd: "",
          yetkiliSoyad: "",
          il: "",
          ilce: "",
          telefon: "",
          mail: "",
          vergiDairesi: "",
          vergiNo: "",
        };
  cariTanimInputFill(data);
};

const cariTanimInputFill = (data) => {
  $("#app-screen").html("");
  $("#app-screen").append(`<div class="cari-tanim-ekle-screen">
            <h1 class="text-center">Cari Tanım Düzenle</h1>
            <div class="d-flex w-25 justify-content-between mt-5">
              <label for="cari-tanim-id-input">Id:</label>
              <input type="number" id="cari-tanim-id-input" name="cari-tanim-id-input" readonly value="${data.id}"/>
            </div>
            <div class="d-flex w-25 justify-content-between mt-2 position-relative">
              <label for="cari-tanim-kod-input">Cari Kod: <sup>*</sup></label>
              <input type="text" autofocus onchange="cariTanimInputFillByKod(event)" id="cari-tanim-kod-input" title="Tabloyu doldurmak için kodu girip Enter'a basın. Yeni bir kod için alt+Enter(option+Enter for Mac)'a basın" name="cari-tanim-kod-input" value="${data.kod}"/>
              <button onclick="cariTanimAutoKod()" class="cari-tanim-autokod-btn btn btn-primary">Auto Kod</button>
            </div>
            <div class="d-flex w-25 justify-content-between mt-2">
              <label for="cari-tanim-unvan-input">Ticari Ünvan: <sup>*</sup></label>
              <input type="text" id="cari-tanim-unvan-input" name="cari-tanim-unvan-input" value="${data.ticariUnvan}"/>
            </div>
            <div class="d-flex w-25 justify-content-between mt-2">
              <label for="cari-tanim-ad-input">Ad: <sup>*</sup></label>
              <input type="text" id="cari-tanim-ad-input" name="cari-tanim-ad-input" value="${data.yetkiliAd}"/>
            </div>
            <div class="d-flex w-25 justify-content-between mt-2">
              <label for="cari-tanim-soyad-input">Soyad: <sup>*</sup></label>
              <input type="text" id="cari-tanim-soyad-input" name="cari-tanim-soyad-input" value="${data.yetkiliSoyad}"/>
            </div>
            <div class="d-flex w-25 justify-content-between mt-2">
              <label for="cari-tanim-il-input">İl:</label>
              <input type="text" id="cari-tanim-il-input" name="cari-tanim-il-input" value="${data.il}"/>
            </div>
            <div class="d-flex w-25 justify-content-between mt-2">
              <label for="cari-tanim-ilce-input">İlçe:</label>
              <input type="text" id="cari-tanim-ilce-input" name="cari-tanim-ilce-input" value="${data.ilce}"/>
            </div>
            <div class="d-flex w-25 justify-content-between mt-2">
              <label for="cari-tanim-telefon-input">Telefon:</label>
              <input type="text" id="cari-tanim-telefon-input" name="cari-tanim-telefon-input" value="${data.telefon}"/>
            </div>
            <div class="d-flex w-25 justify-content-between mt-2">
              <label for="cari-tanim-mail-input">Mail:</label>
              <input type="text" id="cari-tanim-mail-input" name="cari-tanim-mail-input" value="${data.mail}"/>
            </div>
            <div class="d-flex w-25 justify-content-between mt-2">
              <label for="cari-tanim-vergi-daire-input">Vergi Dairesi:</label>
              <input type="text" id="cari-tanim-vergi-daire-input" name="cari-tanim-vergi-daire-input" value="${data.vergiDairesi}"/>
            </div>
            <div class="d-flex w-25 justify-content-between mt-2">
              <label for="cari-tanim-vergi-no-input">Vergi No:</label>
              <input type="text" id="cari-tanim-vergi-no-input" name="cari-tanim-vergi-no-input" value="${data.vergiNo}"/>
            </div>
            <div class="d-flex w-25 justify-content-end mt-3 gap-2">
              <button onclick="menuCariTanimUi()" type="button" class="btn btn-warning cancelBtn">İptal</button>
              <button onclick="cariTanimDelete(event)" data-cari-kod="${data.kod}" type="button" class="btn btn-danger deleteBtn">Sil</button>
              <button onclick="cariTanimKaydetBtn()" id="cari-tanim-kaydet" type="button" class="btn btn-success">Kaydet</button>
            </div>
          </div>`);
  //$("#cari-tanim-kaydet").on("click", cariTanimKaydetBtn);
  //$(".cari-tanim-autokod-btn").on("click", cariTanimAutoKod);
  //$(".deleteBtn").on("click", cariTanimDelete);
  //$(".cancelBtn").on("click", menuCariTanimUi);
  //$("#cari-tanim-kod-input").on("change", cariTanimInputFillByKod);
};

const cariTanimInputFillByKod = (e) => {
  let data = getData(e.target.value, "kod", cariTanim);
  if (data != null) {
    $(".tooltip").remove();
    cariTanimInputFill(data);
  }
};

const cariTanimAutoKod = () => {
  $("#cari-tanim-kod-input").val(autoKod($("#cari-tanim-kod-input").val(), "kod", cariTanim));
};

const cariTanimKaydetBtn = () => {
  if ($("#cari-tanim-kod-input").val() && $("#cari-tanim-unvan-input").val() && $("#cari-tanim-ad-input").val() && $("#cari-tanim-soyad-input").val()) {
    addData(
      {
        id: +$("#cari-tanim-id-input").val(),
        kod: $("#cari-tanim-kod-input").val(),
        ticariUnvan: $("#cari-tanim-unvan-input").val(),
        yetkiliAd: $("#cari-tanim-ad-input").val(),
        yetkiliSoyad: $("#cari-tanim-soyad-input").val(),
        il: $("#cari-tanim-il-input").val(),
        ilce: $("#cari-tanim-ilce-input").val(),
        telefon: $("#cari-tanim-telefon-input").val(),
        mail: $("#cari-tanim-mail-input").val(),
        vergiDairesi: $("#cari-tanim-vergi-daire-input").val(),
        vergiNo: $("#cari-tanim-vergi-no-input").val(),
      },
      "kod",
      cariTanim
    );
    menuCariTanimUi();
  } else {
    alert("Lütfen gerekli alanları doldurunuz!");
  }
};

const cariTanimFiltre = () => {
  $(".cari-tanim-table-body").html("");
  let filteredItems = searchData($("#cari-tanim-filter").val(), cariTanim);
  cariTanimTableFill(filteredItems);
  $(".cari-tanim-table-body tr").on("click", cariTanimDuzenle);
};

const cariTanimDelete = (e) => {
  deleteData(e.target.dataset.cariKod, "kod", cariTanim);
  menuCariTanimUi();
};

const sortRows = () => {
  let sortedArr = sortData("kod", cariTanim);
  cariTanimTableFill(sortedArr);
};
