const menuStokHareketUi = () => {
  $("#app-screen").html("");
  $("#app-screen").append(`<h1 class="text-center">Stok Hareketleri</h1>
          <div class="filter-container d-flex justify-content-center my-3">
            <input class="w-100 px-2" type="text" id="stok-hareket-filter" name="stok-hareket-filter" placeholder="Filtrele"/>
            <button onclick="stokHareketFiltre()" class="btn btn-primary ms-2" id="stok-hareket-filter-btn">Filtrele</button>
          </div>
          <div class="stok-hareket-screen">
            <div class="table-add-container d-flex justify-content-end">
              <button type="button" onclick="stokHareketDuzenle(event)" class="btn btn-success addBtn">Ekle</button>
            </div>
            <table class="table table-hover">
              <thead>
                <tr>
                  <th scope="col" onclick="sortTableStokHareket(event)" data-sort-order="original" data-sort-by="no">Hareket Kodu</th>
                  <th scope="col" onclick="sortTableStokHareket(event)" data-sort-order="original" data-sort-by="stokKodu">Stok Kodu</th>
                  <th scope="col">Stok Adı</th>
                  <th scope="col">Fatura No</th>
                  <th scope="col">Hareket Tipi</th>
                  <th scope="col" onclick="sortTableStokHareket(event)" data-sort-order="original" data-sort-by="tarih">Tarih</th>
                  <th scope="col" onclick="sortTableStokHareket(event)" data-sort-order="original" data-sort-by="girenMiktar">Giren Miktar</th>
                  <th scope="col" onclick="sortTableStokHareket(event)" data-sort-order="original" data-sort-by="cikanMiktar">Çıkan Miktar</th>
                  <th scope="col" onclick="sortTableStokHareket(event)" data-sort-order="original" data-sort-by="birim">Birim</th>
                  <th scope="col" onclick="sortTableStokHareket(event)" data-sort-order="original" data-sort-by="girenFiyat">Giren Fiyat</th>
                  <th scope="col" onclick="sortTableStokHareket(event)" data-sort-order="original" data-sort-by="cikanFiyat">Çıkan Fiyat</th>
                  <th scope="col" onclick="sortTableStokHareket(event)" data-sort-order="original" data-sort-by="girenTutar">Giren Tutar</th>
                  <th scope="col" onclick="sortTableStokHareket(event)" data-sort-order="original" data-sort-by="cikanTutar">Çıkan Tutar</th>
                </tr>
              </thead>
              <tbody class="stok-hareket-table-body">
              </tbody>
            </table>
          </div>`);
  stokHareketTableFill(stokHareket);
};

$("#menu-stok-hareket-btn").on("click", menuStokHareketUi);

const sortTableStokHareket = (e) => {
  stokHareketTableFill(sortTable(e, stokHareket));
};

const stokHareketTableFill = (source) => {
  $(".stok-hareket-table-body").html("");
  source.map((item) =>
    $(".stok-hareket-table-body").append(`<tr onclick="stokHareketDuzenle(event)" data-kod="${item.no}">
                  <td>${item.no}</td>
                  <td>${item.stokKodu}</td>
                  <td>${getData(item.stokKodu, "kod", stokTanim).ad}</td>
                  <td>${item.faturaNo}</td>
                  <td>${item.hareketTipi}</td>
                  <td>${dateFormatter.format(new Date(item.tarih))}</td>
                  <td>${item.girenMiktar}</td>
                  <td>${item.cikanMiktar}</td>
                  <td>${item.birim}</td>
                  <td>${currencyFormatter.format(item.girenFiyat)}</td>
                  <td>${currencyFormatter.format(item.cikanFiyat)}</td>
                  <td>${currencyFormatter.format(item.girenTutar)}</td>
                  <td>${currencyFormatter.format(item.cikanTutar)}</td>
                </tr>`)
  );
};

const stokHareketDuzenle = (e) => {
  let currentData = getData($(e.target).parents("tr").data("kod"), "no", stokHareket);
  let data =
    currentData != null
      ? currentData
      : {
          id: stokHareket.length ? stokHareket[stokHareket.length - 1].id + 1 : 1,
          no: "",
          stokKodu: "",
          faturaNo: "",
          hareketTipi: "",
          tarih: Date.now(),
          girenMiktar: 0,
          cikanMiktar: 0,
          birim: "",
          girenFiyat: 0,
          cikanFiyat: 0,
          girenTutar: 0,
          cikanTutar: 0,
        };
  stokHareketInputFill(data);
};

const stokHareketInputFill = (data) => {
  $("#app-screen").html("");
  $("#app-screen").append(`<div class="stok-hareket-ekle-screen">
      <h1 class="text-center">Stok Hareket Düzenle</h1>
      <div class="d-flex w-25 justify-content-between mt-5">
        <label for="stok-hareket-id-input">Id:</label>
        <input type="text" id="stok-hareket-id-input" name="stok-hareket-id-input" readonly value="${data.id}"/>
      </div>
      <div class="d-flex w-25 justify-content-between mt-2 position-relative">
        <label for="stok-hareket-kod-input">Hareket No: <sup>*</sup></label>
        <input type="text" autofocus onchange="stokHareketInputFillByNo(event)" id="stok-hareket-kod-input" name="stok-hareket-kod-input" value="${
          data.no
        }" title="Tabloyu doldurmak için kodu girip Enter'a basın. Yeni bir kod için alt+Enter(option+Enter for Mac)'a basın"/>
        <button onclick="stokHareketAutoKod()" class="stok-hareket-autokod-btn btn btn-primary">Auto Kod</button>
      </div>
      <div class="d-flex w-25 justify-content-between mt-2">
        <label for="stok-hareket-stok-kod-input">Stok Kodu: <sup>*</sup></label>
        <input type="text" onchange="stokHareketInputFillByKod(event)" id="stok-hareket-stok-kod-input" name="stok-hareket-stok-kod-input" value="${data.stokKodu}"/>
      </div>
      <div class="d-flex w-25 justify-content-between mt-2">
        <label for="stok-hareket-ad-input">Stok Adı:</label>
        <input type="text" id="stok-hareket-ad-input" name="stok-hareket-ad-input" readonly value="${data.stokKodu == "" ? "" : getData(data.stokKodu, "kod", stokTanim).ad}"/>
      </div>
      <div class="d-flex w-25 justify-content-between mt-2">
        <label for="stok-hareket-fatura-no-input">Fatura No:</label>
        <input type="text" id="stok-hareket-fatura-no-input" name="stok-hareket-fatura-no-input" readonly value="${data.faturaNo}"/>
      </div>
      <div class="d-flex w-25 justify-content-between mt-2">
        <label for="stok-hareket-hareket-tipi-input">Hareket Tipi:</label>
        <input type="text" id="stok-hareket-hareket-tipi-input" name="stok-hareket-hareket-tipi-input" readonly value="${data.hareketTipi}"/>
      </div>
      <div class="d-flex w-25 justify-content-between mt-2">
        <label for="stok-hareket-tarih-input">Tarih:</label>
        <input type="text" id="stok-hareket-tarih-input" name="stok-hareket-tarih-input" value="${dateFormatter.format(new Date(data.tarih))}"/>
      </div>
      <div class="d-flex w-25 justify-content-between mt-2">
        <label for="stok-hareket-giren-miktar-input">Giren Miktar: <sup>*</sup></label>
        <input type="text" oninput="stokHareketTutar(event)" id="stok-hareket-giren-miktar-input" name="stok-hareket-giren-miktar-input" value="${data.girenMiktar}"/>
      </div>
      <div class="d-flex w-25 justify-content-between mt-2">
        <label for="stok-hareket-cikan-miktar-input">Çıkan Miktar: <sup>*</sup></label>
        <input type="text" oninput="stokHareketTutar(event)" id="stok-hareket-cikan-miktar-input" name="stok-hareket-cikan-miktar-input" value="${data.cikanMiktar}"/>
      </div>
      <div class="d-flex w-25 justify-content-between mt-2">
        <label for="stok-hareket-birim-input">Birim:</label>
        <input type="text" id="stok-hareket-birim-input" name="stok-hareket-birim-input" value="${data.birim}"/>
      </div>
      <div class="d-flex w-25 justify-content-between mt-2">
        <label for="stok-hareket-giren-fiyat-input">Giren Fiyat: <sup>*</sup></label>
        <input type="text" oninput="stokHareketTutar(event)" onfocusin="currencyInputReverseFormatter(event)" onfocusout="currencyInputFormatter(event)" id="stok-hareket-giren-fiyat-input" name="stok-hareket-giren-fiyat-input" value="${currencyFormatter.format(
          data.girenFiyat
        )}"/>
      </div>
      <div class="d-flex w-25 justify-content-between mt-2">
        <label for="stok-hareket-cikan-fiyat-input">Çıkan Fiyat: <sup>*</sup></label>
        <input type="text" oninput="stokHareketTutar(event)" onfocusin="currencyInputReverseFormatter(event)" onfocusout="currencyInputFormatter(event)" id="stok-hareket-cikan-fiyat-input" name="stok-hareket-cikan-fiyat-input" value="${currencyFormatter.format(
          data.cikanFiyat
        )}"/>
      </div>
      <div class="d-flex w-25 justify-content-between mt-2">
        <label for="stok-hareket-giren-tutar-input">Giren Tutar:</label>
        <input type="text" onfocusin="currencyInputReverseFormatter(event)" onfocusout="currencyInputFormatter(event)" id="stok-hareket-giren-tutar-input" name="stok-hareket-giren-tutar-input" value="${currencyFormatter.format(
          data.girenTutar
        )}"/>
      </div>
      <div class="d-flex w-25 justify-content-between mt-2">
        <label for="stok-hareket-cikan-tutar-input">Çıkan Tutar:</label>
        <input type="text" onfocusin="currencyInputReverseFormatter(event)" onfocusout="currencyInputFormatter(event)" id="stok-hareket-cikan-tutar-input" name="stok-hareket-cikan-tutar-input" value="${currencyFormatter.format(
          data.cikanTutar
        )}"/>
      </div>
      <div class="d-flex w-25 justify-content-end mt-3 gap-2">
        <button type="button" onclick="menuStokHareketUi()" class="btn btn-warning cancelBtn">İptal</button>
        <button data-kod="${data.no}" onclick="stokHareketDelete(event)" type="button" class="btn btn-danger deleteBtn">Sil</button>
        <button id="stok-hareket-kaydet" onclick="stokHareketKaydetBtn()" type="button" class="btn btn-success">Kaydet</button>
      </div>
    </div>`);
  $("#stok-hareket-tarih-input").datepicker({ dateFormat: "dd/mm/yy" });
};

const stokHareketInputFillByNo = (e) => {
  let data = getData(e.target.value, "no", stokHareket);
  if (data != null) {
    $(".tooltip").remove();
    stokHareketInputFill(data);
  }
};

const stokHareketInputFillByKod = (e) => {
  let value = e.target.value;
  let data = getData(value, "kod", stokTanim);
  $("#stok-hareket-ad-input").val(data.ad);
  $("#stok-hareket-birim-input").val(data.birim);
  $("#stok-hareket-giren-fiyat-input").val(currencyFormatter.format(data.fiyat));
  $("#stok-hareket-cikan-fiyat-input").val(currencyFormatter.format(data.fiyat));
};
const stokHareketAutoKod = () => {
  $("#stok-hareket-kod-input").val(autoKod($("#stok-hareket-kod-input").val(), "no", stokHareket));
};

const stokHareketKaydetBtn = () => {
  if (!$("#stok-hareket-fatura-no-input").val()) {
    if (
      $("#stok-hareket-kod-input").val() &&
      $("#stok-hareket-stok-kod-input").val() &&
      (typeof +$("#stok-hareket-giren-miktar-input").val() == "number" || typeof +$("#stok-hareket-cikan-miktar-input").val() == "number") &&
      (typeof +$("#stok-hareket-giren-fiyat-input").val() == "number" || typeof +$("#stok-hareket-cikan-fiyat-input").val() == "number")
    ) {
      if (getIndex($("#stok-hareket-stok-kod-input").val(), "kod", stokTanim) > -1) {
        addData(
          {
            id: +$("#stok-hareket-id-input").val(),
            no: $("#stok-hareket-kod-input").val(),
            stokKodu: $("#stok-hareket-stok-kod-input").val(),
            faturaNo: $("#stok-hareket-fatura-no-input").val(),
            hareketTipi: $("#stok-hareket-hareket-tipi-input").val(),
            tarih: new Date($("#stok-hareket-tarih-input").datepicker("getDate").getTime()).toJSON(),
            girenMiktar: +$("#stok-hareket-giren-miktar-input").val(),
            cikanMiktar: +$("#stok-hareket-cikan-miktar-input").val(),
            birim: $("#stok-hareket-birim-input").val(),
            girenFiyat: +currencyReverseFormatter($("#stok-hareket-giren-fiyat-input").val()),
            cikanFiyat: +currencyReverseFormatter($("#stok-hareket-cikan-fiyat-input").val()),
            girenTutar: +currencyReverseFormatter($("#stok-hareket-giren-tutar-input").val()),
            cikanTutar: +currencyReverseFormatter($("#stok-hareket-cikan-tutar-input").val()),
          },
          "no",
          stokHareket
        );
        menuStokHareketUi();
      } else {
        alert("Bu stok koduna sahip bir stok tanımı bulunamadı!");
      }
    } else {
      alert("Lütfen gerekli alanları doldurunuz!");
    }
  } else {
    alert("Lütfen bu veriyi bağlı olduğu fatura üzerinden düzenleyiniz!");
  }
};

const stokHareketFiltre = () => {
  $(".stok-hareket-table-body").html("");
  let filteredItems = searchData($("#stok-hareket-filter").val(), stokHareket);
  stokHareketTableFill(filteredItems);
};

const stokHareketDelete = (e) => {
  if (!$("#stok-hareket-fatura-no-input").val()) {
    deleteData(e.target.dataset.kod, "no", stokHareket);
    saveToStorageAll();
    menuStokHareketUi();
  } else {
    alert("Lütfen bu veriyi kendi faturasından düzenleyiniz!");
  }
};

const stokHareketTutar = (e) => {
  let girenMiktar = $("#stok-hareket-giren-miktar-input").val();
  let cikanMiktar = $("#stok-hareket-cikan-miktar-input").val();
  let girenFiyat;
  let cikanFiyat;
  if (e.target == document.querySelector("#stok-hareket-giren-miktar-input")) {
    girenFiyat = currencyReverseFormatter($("#stok-hareket-giren-fiyat-input").val());
    cikanFiyat = currencyReverseFormatter($("#stok-hareket-cikan-fiyat-input").val());
  } else if (e.target == document.querySelector("#stok-hareket-giren-fiyat-input")) {
    girenFiyat = $("#stok-hareket-giren-fiyat-input").val();
    cikanFiyat = currencyReverseFormatter($("#stok-hareket-cikan-fiyat-input").val());
  } else if (e.target == document.querySelector("#stok-hareket-cikan-miktar-input")) {
    girenFiyat = currencyReverseFormatter($("#stok-hareket-giren-fiyat-input").val());
    cikanFiyat = currencyReverseFormatter($("#stok-hareket-cikan-fiyat-input").val());
  } else if (e.target == document.querySelector("#stok-hareket-cikan-fiyat-input")) {
    girenFiyat = currencyReverseFormatter($("#stok-hareket-giren-fiyat-input").val());
    cikanFiyat = $("#stok-hareket-cikan-fiyat-input").val();
  }
  if ((girenMiktar != "" && girenFiyat != "") || (cikanMiktar != "" && cikanFiyat != "")) {
    $("#stok-hareket-giren-tutar-input").val(currencyFormatter.format(+girenMiktar * +girenFiyat));
    $("#stok-hareket-cikan-tutar-input").val(currencyFormatter.format(+cikanMiktar * +cikanFiyat));
  }
};
