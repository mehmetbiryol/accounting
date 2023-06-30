let makbuzKalemReference;
let makbuzKalemLastId;
const makbuzKalemTableFill = (source) => {
  makbuzKalemReference = source;
  makbuzKalemLastId = makbuzKalem[makbuzKalem.length - 1].id;
  $(".makbuz-kalem-ekle-screen").append(`
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Kasa Kodu</th>
                <th scope="col">Kasa Adı</th>
                <th scope="col">İşlem Türü</th>
                <th scope="col">Tutar</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody class="makbuz-kalem-table-body">
            </tbody>
          </table>
        `);
  source.map((item) =>
    $(".makbuz-kalem-table-body").append(`<tr data-id="${item.id}">
                  <td><input data-used=true class="makbuz-kalem-kasa-kod-input" onchange="makbuzKalemInputFillByKod(event)" type="text" value="${item.kasaKodu}"</td>
                  <td><input class="makbuz-kalem-kasa-ad-input" type="text" value="${getData(item.kasaKodu, "kod", kasaTanim).ad}"</td>
                  <td><input class="makbuz-kalem-islem-turu-input" type="text" value="${item.islemTuru}"</td>
                  <td><input class="makbuz-kalem-tutar-input" onchange="makbuzTotals()" type="text" onfocusin="currencyInputReverseFormatter(event)" onfocusout="currencyInputFormatter(event)" value="${currencyFormatter.format(
                    item.tutar
                  )}"</td>
                  <td><button type="button" onclick="makbuzKalemDeleteBtn(event)" class="btn btn-danger makbuz-kalem-delete-btn">Sil</button></td>
                </tr>`)
  );
  makbuzKalemNewRow();
};

const makbuzKalemNewRow = () => {
  makbuzKalemLastId += 1;
  $(".makbuz-kalem-table-body").append(`<tr data-id="${makbuzKalemLastId}">
                  <td><input data-used=false class="makbuz-kalem-kasa-kod-input" oninput="makbuzKalemAddRowAfterInput(event)" onchange="makbuzKalemInputFillByKod(event)" type="text" value=""</td>
                  <td><input class="makbuz-kalem-kasa-ad-input" type="text" value=""</td>
                  <td><input class="makbuz-kalem-islem-turu-input" type="text" value=""</td>
                  <td><input class="makbuz-kalem-tutar-input" type="text" onfocusin="currencyInputReverseFormatter(event)" onfocusout="currencyInputFormatter(event)" onchange="makbuzTotals()" value=""</td>
                  <td><button type="button" onclick="makbuzKalemDeleteBtn(event)" class="btn btn-danger makbuz-kalem-delete-btn">Sil</button></td>
                </tr>`);
};

const makbuzKalemAddRowAfterInput = (e) => {
  if (e.target.dataset.used == "false") {
    e.target.dataset.used = "true";
    makbuzKalemNewRow();
  }
};

const totalconsole = () => {};

const makbuzTotals = () => {
  let kalemTutarInputs;
  setTimeout(() => {
    kalemTutarInputs = document.querySelectorAll(".makbuz-kalem-tutar-input");
    let kalemTutarlari = [];
    kalemTutarInputs.forEach((item) => kalemTutarlari.push(+currencyReverseFormatter(item.value)));
    let toplam = kalemTutarlari.reduce((total, current) => total + current, 0);

    $("#makbuz-toplam-tutar-input").val(currencyFormatter.format(toplam));
  }, 1);
};

const makbuzKalemInputFillByKod = (e) => {
  let kasaKodu = e.target.value;
  let itemRow = $(e.target).parent().parent();
  let item = getData(kasaKodu, "kod", kasaTanim);
  if (item != null) {
    itemRow.children().children(".makbuz-kalem-kasa-ad-input").val(item.ad);
  }
};

const makbuzKalemDeleteBtn = (e) => {
  let row = $(e.target).parent().parent();
  row.remove();
  makbuzTotals();
};
