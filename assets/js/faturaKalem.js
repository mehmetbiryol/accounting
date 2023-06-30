let faturaKalemReference;
let faturaKalemLastId;
const faturaKalemTableFill = (source) => {
  faturaKalemReference = source;
  faturaKalemLastId = faturaKalem[faturaKalem.length - 1].id;
  $(".fatura-kalem-ekle-screen").append(`
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Stok Kodu</th>
                <th scope="col">Stok Adı</th>
                <th scope="col">Miktar</th>
                <th scope="col">Birim</th>
                <th scope="col">Fiyat</th>
                <th scope="col">Tutar</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody class="fatura-kalem-table-body">
            </tbody>
          </table>
        `);
  source.map((item) =>
    $(".fatura-kalem-table-body").append(`<tr data-id="${item.id}">
                  <td><input data-used=true class="fatura-kalem-stok-kod-input" onchange="faturaKalemInputFillByKod(event); faturaKalemTotals(event)" type="text" value="${item.stokKodu}"</td>
                  <td><input class="fatura-kalem-stok-ad-input" type="text" value="${getData(item.stokKodu, "kod", stokTanim).ad}"</td>
                  <td><input class="fatura-kalem-miktar-input" onchange="faturaKalemTotals(event)" type="text" value="${item.miktar}"</td>
                  <td><input class="fatura-kalem-birim-input" type="text" value="${item.birim}"</td>
                  <td><input class="fatura-kalem-fiyat-input" onchange="faturaKalemTotals(event)"  onfocusin="currencyInputReverseFormatter(event)" onfocusout="currencyInputFormatter(event)" type="text" value="${currencyFormatter.format(
                    item.fiyat
                  )}"</td>
                  <td><input class="fatura-kalem-tutar-input" type="text" readonly value="${currencyFormatter.format(item.tutar)}"</td>
                  <td><button type="button" onclick="faturaKalemDeleteBtn(event)" class="btn btn-danger fatura-kalem-delete-btn">Sil</button></td>
                </tr>`)
  );
  faturaKalemNewRow();
};

const faturaKalemNewRow = () => {
  faturaKalemLastId += 1;
  $(".fatura-kalem-table-body").append(`<tr data-id="${faturaKalemLastId}">
                  <td><input data-used=false class="fatura-kalem-stok-kod-input" oninput="faturaKalemAddRowAfterInput(event)" onchange="faturaKalemInputFillByKod(event); faturaKalemTotals(event)" type="text" value=""</td>
                  <td><input class="fatura-kalem-stok-ad-input" type="text" value=""</td>
                  <td><input class="fatura-kalem-miktar-input" onchange="faturaKalemTotals(event)" type="text" value=""</td>
                  <td><input class="fatura-kalem-birim-input" type="text" value=""</td>
                  <td><input class="fatura-kalem-fiyat-input" onchange="faturaKalemTotals(event)"  onfocusin="currencyInputReverseFormatter(event)" onfocusout="currencyInputFormatter(event)" type="text" value=""</td>
                  <td><input class="fatura-kalem-tutar-input" type="text" readonly value=""</td>
                  <td><button type="button" onclick="faturaKalemDeleteBtn(event)" class="btn btn-danger fatura-kalem-delete-btn">Sil</button></td>
                </tr>`);
};

const faturaKalemAddRowAfterInput = (e) => {
  if (e.target.dataset.used == "false") {
    e.target.dataset.used = "true";
    faturaKalemNewRow();
  }
};

const faturaKalemTotals = (e) => {
  let item = $(e.target).parent().parent();
  let totalInput = item.children().children(".fatura-kalem-tutar-input");
  let miktar = +item.children().children(".fatura-kalem-miktar-input").val();
  let fiyatInputValue = item.children().children(".fatura-kalem-fiyat-input").val();
  let fiyat = isNaN(fiyatInputValue) ? currencyReverseFormatter(fiyatInputValue) : +fiyatInputValue;
  totalInput.val(currencyFormatter.format(miktar * fiyat));
  faturaTotals();
};

const faturaTotals = () => {
  let kalemTutarInputs = document.querySelectorAll(".fatura-kalem-tutar-input");
  let kalemTutarlari = [];
  kalemTutarInputs.forEach((item) => kalemTutarlari.push(+currencyReverseFormatter(item.value)));
  let toplam = kalemTutarlari.reduce((total, current) => total + current, 0);
  let iskontoOran = +$("#fatura-iskonto-oran-input").val();
  let iskontoTutar = toplam * (iskontoOran / 100);
  let araToplam = toplam - iskontoTutar;
  let kdvOran = +$("#fatura-kdv-input").val();
  let kdvTutar = araToplam * (kdvOran / 100);
  let genelToplam = araToplam + kdvTutar;

  $("#fatura-toplam-input").val(currencyFormatter.format(toplam));
  $("#fatura-iskonto-tutar-input").val(currencyFormatter.format(iskontoTutar));
  $("#fatura-ara-toplam-input").val(currencyFormatter.format(araToplam));
  $("#fatura-kdv-tutar-input").val(currencyFormatter.format(kdvTutar));
  $("#fatura-genel-toplam-input").val(currencyFormatter.format(genelToplam));
};

const faturaKalemInputFillByKod = (e) => {
  let stokKodu = e.target.value;
  let itemRow = $(e.target).parent().parent();
  let item = getData(stokKodu, "kod", stokTanim);
  if (item != null) {
    itemRow.children().children(".fatura-kalem-birim-input").val(item.birim);
    itemRow.children().children(".fatura-kalem-stok-ad-input").val(item.ad);
    itemRow.children().children(".fatura-kalem-fiyat-input").val(currencyFormatter.format(item.fiyat));
  }
};

const faturaKalemDeleteBtn = (e) => {
  let row = $(e.target).parent().parent();
  row.remove();
  faturaTotals();
};
