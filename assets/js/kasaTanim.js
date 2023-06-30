const menuKasaTanimUi = () => {
  $("#app-screen").html("");
  $("#app-screen").append(`<h1 class="text-center">Kasa Tanımları</h1>
          <div class="filter-container d-flex justify-content-center my-3">
            <input class="w-100 px-2" type="text" id="kasa-tanim-filter" name="kasa-tanim-filter" placeholder="Filtrele"/>
            <button class="btn btn-primary ms-2" onclick="kasaTanimFiltre()" id="kasa-tanim-filter-btn">Filtrele</button>
          </div>
          <div class="kasa-tanim-screen">
            <div class="table-add-container d-flex justify-content-end">
              <button type="button" onclick="kasaTanimDuzenle(event)" class="btn btn-success addBtn">Ekle</button>
            </div>
            <table class="table table-hover">
              <thead>
                <tr>
                  <th scope="col" onclick="sortTableKasaTanim(event)" data-sort-order="original" data-sort-by="kod">Kasa Kodu</th>
                  <th scope="col" onclick="sortTableKasaTanim(event) data-sort-order="original" data-sort-by="ad">Kasa Adı</th>
                  <th scope="col" onclick="sortTableKasaTanim(event) data-sort-order="original" data-sort-by="yetkili">Yetkili</th>
                </tr>
              </thead>
              <tbody class="kasa-tanim-table-body">
              </tbody>
            </table>
          </div>`);
  kasaTanimTableFill(kasaTanim);
};

$("#menu-kasa-tanim-btn").on("click", menuKasaTanimUi);

const sortTableKasaTanim = (e) => {
  kasaTanimTableFill(sortTable(e, kasaTanim));
};

const kasaTanimTableFill = (source) => {
  $(".kasa-tanim-table-body").html("");
  source.map((item) =>
    $(".kasa-tanim-table-body").append(`<tr onclick="kasaTanimDuzenle(event)" data-kod="${item.kod}">
                  <td>${item.kod}</td>
                  <td>${item.ad}</td>
                  <td>${item.yetkili}</td>
                </tr>`)
  );
};

const kasaTanimDuzenle = (e) => {
  let currentData = getData($(e.target).parents("tr").data("kod"), "kod", kasaTanim);
  let data =
    currentData != null
      ? currentData
      : {
          id: kasaTanim.length ? kasaTanim[kasaTanim.length - 1].id + 1 : 1,
          kod: "",
          ad: "",
          yetkili: "",
        };
  kasaTanimInputFill(data);
};

const kasaTanimInputFill = (data) => {
  $("#app-screen").html("");
  $("#app-screen").append(`<div class="kasa-tanim-ekle-screen">
      <h1 class="text-center">Kasa Tanım Düzenle</h1>
      <div class="d-flex w-25 justify-content-between mt-5">
        <label for="kasa-tanim-id-input">Id:</label>
        <input type="text" id="kasa-tanim-id-input" name="kasa-tanim-id-input" readonly value="${data.id}"/>
      </div>
      <div class="d-flex w-25 justify-content-between mt-2 position-relative">
        <label for="kasa-tanim-kod-input">Kasa Kodu: <sup>*</sup></label>
        <input type="text" autofocus onchange="kasaTanimInputFillByKod(event)" id="kasa-tanim-kod-input" name="kasa-tanim-kod-input" value="${data.kod}" title="Tabloyu doldurmak için kodu girip Enter'a basın. Yeni bir kod için alt+Enter(option+Enter for Mac)'a basın"/>
        <button onclick="kasaTanimAutoKod()" class="kasa-tanim-autokod-btn btn btn-primary">Auto Kod</button>
      </div>
      <div class="d-flex w-25 justify-content-between mt-2">
        <label for="kasa-tanim-ad-input">Kasa Adı: <sup>*</sup></label>
        <input type="text" id="kasa-tanim-ad-input" name="kasa-tanim-ad-input" value="${data.ad}"/>
      </div>
      <div class="d-flex w-25 justify-content-between mt-2">
        <label for="kasa-tanim-yetkili-input">Kasa Yetkilisi:</label>
        <input type="text" id="kasa-tanim-yetkili-input" name="kasa-tanim-yetkili-input" value="${data.yetkili}"/>
      </div>
      <div class="d-flex w-25 justify-content-end mt-3 gap-2">
        <button type="button" onclick="menuKasaTanimUi()" class="btn btn-warning cancelBtn">İptal</button>
        <button data-kasa-kod="${data.kod}" onclick="kasaTanimDelete(event)" type="button" class="btn btn-danger deleteBtn">Sil</button>
        <button onclick="kasaTanimKaydetBtn()" id="kasa-tanim-kaydet" type="button" class="btn btn-success">Kaydet</button>
      </div>
    </div>`);
  //$("#kasa-tanim-kaydet").on("click", kasaTanimKaydetBtn);
  //$(".kasa-tanim-autokod-btn").on("click", kasaTanimAutoKod);
  //$(".deleteBtn").on("click", kasaTanimDelete);
  //$(".cancelBtn").on("click", menuKasaTanimUi);
  //$("#kasa-tanim-kod-input").on("change", kasaTanimInputFillByKod);
  //$("#kasa-tanim-kod-input").tooltip();
};

const kasaTanimInputFillByKod = (e) => {
  let data = getData(e.target.value, "kod", kasaTanim);
  if (data != null) {
    $(".tooltip").remove();
    kasaTanimInputFill(data);
  }
};

const kasaTanimAutoKod = () => {
  $("#kasa-tanim-kod-input").val(autoKod($("#kasa-tanim-kod-input").val(), "kod", kasaTanim));
};

const kasaTanimKaydetBtn = () => {
  if ($("#kasa-tanim-kod-input").val() && $("#kasa-tanim-ad-input").val()) {
    addData(
      {
        id: +$("#kasa-tanim-id-input").val(),
        kod: $("#kasa-tanim-kod-input").val(),
        ad: $("#kasa-tanim-ad-input").val(),
        yetkili: $("#kasa-tanim-yetkili-input").val(),
      },
      "kod",
      kasaTanim
    );
    menuKasaTanimUi();
  } else {
    alert("Lütfen gerekli alanları doldurunuz!");
  }
};

const kasaTanimFiltre = () => {
  $(".kasa-tanim-table-body").html("");
  let filteredItems = searchData($("#kasa-tanim-filter").val(), kasaTanim);
  kasaTanimTableFill(filteredItems);
  //$(".kasa-tanim-table-body tr").on("click", kasaTanimDuzenle);
};

const kasaTanimDelete = (e) => {
  deleteData(e.target.dataset.kasaKod, "kod", kasaTanim);
  saveToStorageAll();
  menuKasaTanimUi();
};
