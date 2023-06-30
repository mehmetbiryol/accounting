let cariTanim = [];
let cariHareket = [];
let stokTanim = [];
let stokHareket = [];
let kasaTanim = [];
let kasaHareket = [];
let fatura = [];
let faturaKalem = [];
let makbuz = [];
let makbuzKalem = [];

const getIndex = (value, key, target) => target.findIndex((item) => item[key] == value);

const getData = (value, key, target) => {
  let index = getIndex(value, key, target);
  return index > -1 ? target[index] : null;
};

const filterData = (value, key, target) => target.filter((item) => item[key] == value);

const searchData = (value, target) =>
  target.filter((item) => {
    let objectValues = Object.values(item).filter((objectValue) => typeof objectValue == "string");
    return objectValues.some((x) => x.includes(value));
  });

const addData = (newData, key, target) => {
  let index = getIndex(newData[key], key, target);
  if (index > -1) {
    if (confirm("Var olan veriyi değiştir?")) {
      target[index] = newData;
    }
  } else {
    target.push(newData);
  }
  saveToStorageAll();
};

const deleteData = (value, key, target) => {
  if (confirm("Bu veriyi silmek istediğinizden emin misiniz?")) {
    deleteWithoutConfirmation(value, key, target);
  }
};

const deleteWithoutConfirmation = (value, key, target) => {
  let index = getIndex(value, key, target);
  if (index > -1) {
    target.splice(index, 1);
  }
  saveToStorageAll();
};

const findPrefix = (value) => {
  let prefix;
  const numerics = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  if (value.length != 0) {
    if (numerics.some((item) => item === value[value.length - 1])) {
      for (let i = value.length - 1; i > -1; i--) {
        if (!numerics.includes(value[i])) {
          prefix = value.slice(0, i + 1);
          break;
        }
      }
    } else {
      prefix = value;
    }
  }
  if (!prefix) {
    prefix = "";
  }
  return prefix;
};

const findNextCode = (prefix, targetKey, target) => {
  let numberCode = "";
  let prefixArr = target.filter((item) => findPrefix(item[targetKey]) === prefix);
  if (prefixArr.length) {
    sortData(targetKey, prefixArr);
    let lastCode = prefixArr[prefixArr.length - 1][targetKey];
    let numberLength = lastCode.length - prefix.length;
    let nextNumber = +lastCode.slice(prefix.length) + 1;
    let zeroCount = numberLength - nextNumber.toString().length;
    for (let i = 0; i < zeroCount; i++) {
      numberCode += 0;
    }
    numberCode += nextNumber;
  } else {
    numberCode = "0001";
  }
  return numberCode;
};

const autoKod = (value, targetKey, target) => {
  let prefix = findPrefix(value);
  let nextNumberCode = findNextCode(prefix, targetKey, target);
  return prefix + nextNumberCode;
};

//---------Formatter---------//

const kdvFormatter = new Intl.NumberFormat("en-US", {
  minimumIntegerDigits: 1,
  minimumFractionDigits: 2,
});
const currencyFormatter = new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 2, minimumFractionDigits: 2 });
const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  // hour: "2-digit",
  // minute: "2-digit",
  // second: "2-digit",
  // hour12: false,
});

const currencyInputFormatter = (e) => (e.target.value = currencyFormatter.format(e.target.value));
// = e.target.value.substring(1).replace(".", "").replace(",", ".")
const currencyInputReverseFormatter = (e) => (e.target.value = currencyReverseFormatter(e.target.value));

const currencyReverseFormatter = (data) => (data = data.substring(1).replace(".", "").replace(",", "."));

//-----------------BOOTSTRAP-------------//

const saveToStorage = (storageName, source) => localStorage.setItem(storageName, JSON.stringify(source));

const loadFromStorage = (storageName) => {
  let result = localStorage.getItem(storageName);
  return result ? JSON.parse(result) : [];
};

const loadData = () => {
  cariTanim = loadFromStorage("cariTanim");
  if (!cariTanim.length) {
    cariTanim = [
      {
        id: 1,
        kod: "C-0001",
        ticariUnvan: "Biryol Ticaret",
        yetkiliAd: "Mehmet",
        yetkiliSoyad: "Biryol",
        il: "Rize",
        ilce: "Çamlıhemşin",
        telefon: "05398627707",
        mail: "mehmet1yol@gmail.com",
        vergiDairesi: "Çamlıhemşin",
        vergiNo: "9999999999",
      },
      {
        id: 2,
        kod: "C-0002",
        ticariUnvan: "Paparox Ltd. Şti.",
        yetkiliAd: "Captain",
        yetkiliSoyad: "Paparox",
        il: "Verdansk",
        ilce: "Downtown",
        telefon: "05554444444",
        mail: "paparox@gmail.com",
        vergiDairesi: "Verdansk",
        vergiNo: "1234567890",
      },
    ];
  }

  cariHareket = loadFromStorage("cariHareket");
  if (!cariHareket.length) {
    cariHareket = [
      {
        id: 1,
        no: "CH-0001",
        cariKod: "C-0001",
        tarih: "2023-03-30T21:00:00.000Z",
        islemTuru: "Nakit",
        faturaNo: "",
        makbuzNo: "",
        hareketTipi: "",
        borc: 1000,
        alacak: 0,
      },
      {
        id: 2,
        no: "CH-0002",
        cariKod: "C-0002",
        tarih: "2023-02-30T21:00:00.000Z",
        islemTuru: "Kredi",
        faturaNo: "",
        makbuzNo: "",
        hareketTipi: "",
        borc: 0,
        alacak: 2500,
      },
    ];
  }

  stokTanim = loadFromStorage("stokTanim");
  if (!stokTanim.length) {
    stokTanim = [
      {
        id: 1,
        kod: "S-0001",
        ad: "AK-47",
        fiyat: 100,
        kdv: 8,
        birim: "adet",
        kalan: "kalan",
      },
      {
        id: 2,
        kod: "S-0002",
        ad: "7.62x39mm Ammo",
        fiyat: 150,
        kdv: 18.25,
        birim: "kutu",
        kalan: "kalan2",
      },
    ];
  }

  stokHareket = loadFromStorage("stokHareket");
  if (!stokHareket.length) {
    stokHareket = [
      {
        id: 1,
        no: "SH-0001",
        stokKodu: "S-0001",
        faturaNo: "",
        hareketTipi: "",
        tarih: "2023-02-30T21:00:00.000Z",
        girenMiktar: 10,
        cikanMiktar: 0,
        birim: "Birim",
        girenFiyat: 100,
        cikanFiyat: 0,
        girenTutar: 1000,
        cikanTutar: 0,
      },
      {
        id: 2,
        no: "SH-0002",
        stokKodu: "S-0002",
        faturaNo: "",
        hareketTipi: "",
        tarih: "2023-03-20T21:00:00.000Z",
        girenMiktar: 0,
        cikanMiktar: 10,
        birim: "Birim2",
        girenFiyat: 0,
        cikanFiyat: 150,
        girenTutar: 0,
        cikanTutar: 1500,
      },
    ];
  }

  kasaTanim = loadFromStorage("kasaTanim");
  if (!kasaTanim.length) {
    kasaTanim = [
      {
        id: 1,
        kod: "K-0001",
        ad: "Kasa adı",
        yetkili: "Kasa Yetkilisi",
      },
      {
        id: 2,
        kod: "K-0002",
        ad: "Kasa adı2",
        yetkili: "Kasa Yetkilisi2",
      },
    ];
  }

  kasaHareket = loadFromStorage("kasaHareket");
  if (!kasaHareket.length) {
    kasaHareket = [
      {
        id: 1,
        no: "KH-0001",
        kasaKodu: "K-0001",
        makbuzNo: "",
        hareketTipi: "",
        tarih: "2023-01-30T21:00:00.000Z",
        gelir: 1000,
        gider: 0,
        islemTuru: "İşlem Türü",
      },
      {
        id: 2,
        no: "KH-0002",
        kasaKodu: "K-0002",
        makbuzNo: "",
        hareketTipi: "",
        tarih: "2023-04-30T21:00:00.000Z",
        gelir: 500,
        gider: 1000,
        islemTuru: "İşlem Türü2",
      },
    ];
  }
  fatura = loadFromStorage("fatura");
  if (!fatura.length) {
    fatura = [
      {
        id: 1,
        no: "AF-000001",
        cariKod: "C-0001",
        tarih: "2023-03-30T21:00:00.000Z",
        toplam: 1000,
        iskontoOran: 5,
        iskontoTutar: 50,
        araToplam: 950,
        kdv: 10,
        kdvTutar: 95,
        genelToplam: 1045,
        faturaTipi: "Alış Faturası",
      },
      {
        id: 2,
        no: "SF-000001",
        cariKod: "C-0002",
        tarih: "2023-03-02T21:00:00.000Z",
        toplam: 2000,
        iskontoOran: 5,
        iskontoTutar: 100,
        araToplam: 1900,
        kdv: 10,
        kdvTutar: 190,
        genelToplam: 2090,
        faturaTipi: "Satış Faturası",
      },
    ];
  }
  faturaKalem = loadFromStorage("faturaKalem");
  if (!faturaKalem.length) {
    faturaKalem = [
      {
        id: 1,
        faturaNo: "AF-000001",
        stokKodu: "S-0001",
        miktar: 10,
        birim: "adet",
        fiyat: 100,
        tutar: 1000,
      },
      {
        id: 2,
        faturaNo: "AF-000001",
        stokKodu: "S-0002",
        miktar: 10,
        birim: "kutu",
        fiyat: 150,
        tutar: 1500,
      },
      {
        id: 3,
        faturaNo: "SF-000001",
        stokKodu: "S-0002",
        miktar: 10,
        birim: "adet",
        fiyat: 150,
        tutar: 1500,
      },
      {
        id: 4,
        faturaNo: "SF-000001",
        stokKodu: "S-0001",
        miktar: 10,
        birim: "kutu",
        fiyat: 100,
        tutar: 1000,
      },
    ];
  }
  makbuz = loadFromStorage("makbuz");
  if (!makbuz.length) {
    makbuz = [
      {
        id: 1,
        no: "TS-000001",
        cariKod: "C-0001",
        tarih: "2023-03-30T21:00:00.000Z",
        toplamTutar: 1000,
        makbuzTipi: "Tahsil Makbuzu",
      },
      {
        id: 2,
        no: "TD-000001",
        cariKod: "C-0002",
        tarih: "2023-03-02T21:00:00.000Z",
        toplamTutar: 2000,
        makbuzTipi: "Tediye Makbuzu",
      },
    ];
  }
  makbuzKalem = loadFromStorage("makbuzKalem");
  if (!makbuzKalem.length) {
    makbuzKalem = [
      {
        id: 1,
        makbuzNo: "TS-000001",
        kasaKodu: "K-0001",
        islemTuru: "Nakit",
        tutar: 1000,
      },
      {
        id: 2,
        makbuzNo: "TD-000001",
        kasaKodu: "K-0002",
        islemTuru: "Kredi",
        tutar: 2000,
      },
    ];
  }
};
loadData();

const saveToStorageAll = () => {
  saveToStorage("cariTanim", cariTanim);
  saveToStorage("cariHareket", cariHareket);
  saveToStorage("stokTanim", stokTanim);
  saveToStorage("stokHareket", stokHareket);
  saveToStorage("kasaTanim", kasaTanim);
  saveToStorage("kasaHareket", kasaHareket);
  saveToStorage("fatura", fatura);
  saveToStorage("faturaKalem", faturaKalem);
  saveToStorage("makbuz", makbuz);
  saveToStorage("makbuzKalem", makbuzKalem);
};
saveToStorageAll();

// function sortTableRows(column, uiFunc) {
//   let table = document.querySelector(".table");
//   const tbody = table.querySelector("tbody");
//   const rows = Array.from(tbody.querySelectorAll("tr"));
//   const sortStatus = table.getAttribute("data-sort-status") || "none"; // Get current sort status

//   let sortOrder;
//   if (sortStatus === "asc") {
//     sortOrder = "desc";
//   } else if (sortStatus === "desc") {
//     sortOrder = "none";
//   } else {
//     sortOrder = "asc";
//   }

//   rows.sort((a, b) => {
//     const cellA = a.querySelector(`td:nth-child(${column})`).innerText;
//     const cellB = b.querySelector(`td:nth-child(${column})`).innerText;

//     // Determine whether to sort alphabetically or numerically
//     const isNumeric = !isNaN(parseFloat(cellA)) && !isNaN(parseFloat(cellB));
//     if (isNumeric) {
//       return sortOrder === "asc" ? parseFloat(cellA) - parseFloat(cellB) : sortOrder === "desc" ? parseFloat(cellB) - parseFloat(cellA) : uiFunc();
//     } else {
//       return sortOrder === "asc" ? cellA.localeCompare(cellB) : sortOrder === "desc" ? cellB.localeCompare(cellA) : uiFunc();
//     }
//   });

//   rows.forEach((row) => tbody.appendChild(row));
//   table.setAttribute("data-sort-status", sortOrder); // Set new sort status
// }

const sortData = (targetKey, target) => target.sort((a, b) => a[targetKey] - b[targetKey]);

const sortDataAsc = (sortBy, target) => {
  if (target.every((item) => !isNaN(parseFloat(item[sortBy])))) {
    target.sort((a, b) => a[sortBy] - b[sortBy]);
  } else {
    target.sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
  }
};
const sortDataDesc = (sortBy, target) => {
  if (target.every((item) => !isNaN(parseFloat(item[sortBy])))) {
    target.sort((a, b) => b[sortBy] - a[sortBy]);
  } else {
    target.sort((a, b) => b[sortBy].localeCompare(a[sortBy]));
  }
};

const sortTable = (e, target) => {
  let newArr = [...target];
  let sortBy = e.target.dataset.sortBy;
  if (e.target.dataset.sortOrder == "asc") {
    sortDataDesc(sortBy, newArr);
    e.target.dataset.sortOrder = "desc";
  } else if (e.target.dataset.sortOrder == "desc") {
    sortDataAsc("id", newArr);
    e.target.dataset.sortOrder = "original";
  } else if (e.target.dataset.sortOrder == "original") {
    sortDataAsc(sortBy, newArr);
    e.target.dataset.sortOrder = "asc";
  }
  console.log(newArr);

  return newArr;
};

function roundTo(value, precision) {
  const digits = typeof precision !== "number" ? 2 : precision;
  return Math.round(value * Math.pow(10, digits)) / Math.pow(10, digits);
}

const roundCurrency = (value, precision) => {
  let valueArr = typeof value == "number" ? value.toString().split(".") : value.split(".");
  let valueInt = valueArr[0];
  if (valueArr[1] != undefined) {
    let valueFraction = valueArr[1].split("");
    valueFraction.forEach((item, index) => (valueFraction[index] = +item));
    for (let i = valueFraction.length - 1; i > precision - 1; i--) {
      if (valueFraction[i] > 4) {
        valueFraction[i - 1] = valueFraction[i - 1] + 1;
        valueFraction[i] = 0;
      } else {
        valueFraction[i] = 0;
      }
    }
    valueFraction = valueFraction.splice(0, 4);
    let strFloat = valueFraction.join("");
    if (strFloat.length < 4) {
      for (let i = 0; i < 4 - strFloat.length; i++) {
        strFloat += "0";
      }
    }
    return valueInt + "." + strFloat;
  } else {
    return valueInt + "." + "0000";
  }
};
