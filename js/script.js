$("main").slideDown(500);

function saveArray_0() {
  // 入力値を取得し数値に変換
  const inputElement = document.getElementById("numParticipants");
  const inputValue = parseInt(inputElement.value, 10);

  // 入力値が有効な数値でない場合は処理を終了
  if (isNaN(inputValue) || inputValue <= 0) {
    alert("正しい数値を入力してください");
    return;
  }

  // 入力値の数だけ番号を文字列として格納した配列を作成
  const array = Array.from({ length: inputValue }, (_, i) => String(i + 1));

  // 配列をJSON文字列に変換してlocalStorageに保存
  localStorage.setItem("numberArray", JSON.stringify(array));
  alert("データがlocalStorageに保存されました: " + JSON.stringify(array));
}

// localStorageの中にinitialValueという名前が存在していれば、
if (localStorage.getItem("initialValue")) {
  // initialValueがあれば、initialValueから値を取得して、変数valueに代入する
  value = localStorage.getItem("initialValue");
  // 変数valueの中身をdiv(ID initialValue)に表示する
  $("#initialValue").val(value);
}

// 読み込み
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  const value = localStorage.getItem(key);
  const html = `
      <li>
        <p>${key}</p>
        <p>${value}</p><br>
      </li>
      <br>
    `;
  $("#initialValue").append(html);
}

// 1.Saveボタンクリックで localStorageに保管する
$("#save_memo").on("click", function () {
  //text_areaの値（Value）を取得 → 変数valueに代入
  value = $("#textArea").val();
  //localStorageに"memo"という名前をつけて、変数valueの中身をセットする
  localStorage.setItem("memo", value);
  alert("memoを保存しました。htmlの入力部分を削除します。");
  $("#textArea").val("");
});

$("#save").on("click", function () {
  const key = $("#title").val();
  const value = $("#text").val();
  localStorage.setItem(key, value);
  const html = `
  <table id="key_and_value_output">
  <tbody>
  <tr>
  <td>${key}</td>
  <td>${value}</td>
  </tr>
  </tbody>
  </table>
    `;
  alert("タイトルと内容を全て保存しました");
  $("#key_and_value_output").append(html);
});

// 2.clearボタンクリックで
// localStorage.setItem(key, value);の中身を削除する
$("#clear_memo").on("click", function () {
  //localStorageの"memo"という名前の中身を削除する
  localStorage.removeItem("memo");
  alert("memoを削除しました");
  //text_areaを空文字で上書きする
  $("#textArea").val("");
});

$("#clear").on("click", function () {
  localStorage.clear();
  alert("localStorageを全て削除しました");
  alert("html入力画面上もクリアします");
  // $("#list").empty();
  $("#inputArea").val("");
});

// 3.ページ読み込み：保存データ取得表示

for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  const value = localStorage.getItem(key);
  const html = `
      <li>
        <p>${key}</p>
        <p>${value}</p><br>
      </li>
      <br>
    `;
  $("#key_and_value_output").append(html);
}

// localStorageの中にmemoという名前が存在していれば、
if (localStorage.getItem("memo")) {
  // memoがあれば、memoから値を取得して、変数valueに代入する
  value = localStorage.getItem("memo");
  // 変数valueの中身をtext_areaに表示する
  $("#textArea").val(value);
}

// localStorageの中にデータが存在していれば、
// if (localStorage.getItem(key)) {
//   // key_and_value_outputがあれば、key_and_value_outputから値を取得して、変数valueに代入する
//   value = localStorage.getItem(value);
//   // 変数valueの中身をlistに表示する
//   $("#key_and_value_output").val(key, value);
// }

// 選択された数字を参加人数と
// const numParticipants = parseInt(
//   document.getElementById("numParticipants").value
// );

// let roles = ["speaker", "listener", "observer"];
// let roles_num = Array.from(length, roles);
// console.log(roles);
// console.log(roles_num);

// let currentRound = 0;
// let groupAssignments = [];

// 参加者数を3で割った整数値＝グループの数＝表の行数
const group_num = Math.floor(numParticipants / 3);
// グループの最大人数＝表の列数＝4 参加者が3の倍数でなかった場合は、observerに1人ずつ加え4人1組とする。
const group_size_max = 4;
// 余りを算出する （0,1,2のいずれかになる）
const remainder = numParticipants % 3;

// 参加者数の分、ナンバーを用意
let numbers = Array.from({ length: numParticipants }, (_, i) => i + 1);

$("#numParticipants").on("click", function () {
  $("#textArea").val(numbers);
});
//
// let participants = [];
// let len = array.length;

// ナンバーをFisher–Yates shuffle法でランダムに並べ替える

for (let i = numbers - 1; i > 0; i--) {
  let j = Math.floor(Math.random() * (i + 1));
  let tmp = array[i];
  array[i] = array[j];
  array[j] = tmp;
}

// numbers = numbers.sort(() => Math.random() - 0.5);

// 数字の並びを、配列に入れる
// let count = 0;

// for (let j = 0; j < group_size_max; j++) {
//   const cell = numbers[count++];
// }

// 表をHTML表示させる関数
function generateGrid() {
  // ID値 tableContainer に一致する要素を戻り値として返す
  // const tableContainer = document.getElementById("tableContainer");
  // ID値 tableContainer に一致する要素を戻り値として返す
  const tableContainer = document.getElementById("tableContainer");

  // 表の中身をクリア
  tableContainer.innerHTML = "";
  // document.createElement(tagName) 引数のtagNameで指定されたHTML要素を生成する
  // table要素を生成
  const table = document.createElement("table");
  table.style.borderCollapse = "collapse";

  // 繰り返し処理で表のcellに中身を入れる
  let count = 0;
  for (let i = 0; i < group_num; i++) {
    const row = document.createElement("tr");
    for (let j = 0; j < group_size_max; j++) {
      const cell = document.createElement("td");
      cell.style.border = "1px solid black";
      cell.style.padding = "10px";
      cell.style.textAlign = "center";
      // innerHTMLプロパティで要素の中身を変更する
      cell.innerHTML = numbers[count++];
      // cellの最後の要素としてrowに追加
      row.appendChild(cell);
    }
    // rowの最後の要素としてtableに追加
    table.appendChild(row);
  }
  // 表をtableContainerに追加
  tableContainer.appendChild(table);

  // localStorageに保管する
  function save_first() {
    //tableContainerの値（Value）を取得 → 変数valueに代入
    value = $("#tableContainer").val();
    //localStorageに"first"という名前をつけて、変数valueの中身をセットする
    localStorage.setItem("first", tableContainer.outerHTML);
    alert("1回目を保存しました。");
  }
}

// 2回目
function shiftSecondColumn() {
  // ID値 tableContainer2 に一致する要素を返す
  const tableContainer2 = document.getElementById("tableContainer2");
  // 表の中身に一旦１回目の値を入れる
  tableContainer2.innerHTML = tableContainer.innerHTML;
  // document.createElement(tagName) 引数のtagNameで指定されたHTML要素を生成する
  // table要素を生成
  const table2 = document.createElement("table");
  if (!table2) return;
  const rows2 = Array.from(table2.rows);
  const secondColumnValues = rows2.map((rows2) => rows2.cells[1].textContent);

  // 2列目の値を一つ下にシフト（最後の値は最初に移動）
  secondColumnValues.unshift(secondColumnValues.pop());
  console.table(table2);
  console.table(secondColumnValues);

  // シフト後の値を2列目に設定
  rows2.forEach((rows2, i) => {
    rows2.cells[1].textContent = secondColumnValues[i];
  });
}

// 3回目
function shiftThirdColumn() {
  const table = document.getElementById("generatedTable");
  if (!table) return;

  const rows = Array.from(table.rows);
  const thirdColumnValues = rows.map((row) => row.cells[2].textContent);

  // 3列目の値を一つ上にシフト（最初の値は最後に移動）
  thirdColumnValues.push(thirdColumnValues.shift());

  // シフト後の値を3列目に設定
  rows.forEach((row, i) => {
    row.cells[2].textContent = thirdColumnValues[i];
  });
}

// csvファイルに保存する
function generateCSVContent(round1, round2, round3) {
  let csvContent =
    "参加者番号,1回目のグループ番号,1回目の役割,2回目のグループ番号,2回目の役割,3回目のグループ番号,3回目の役割\n";

  for (let i = 1; i <= numParticipants; i++) {
    let groupNumber1, role1;
    if (round1) {
      for (let j = 0; j < round1.groups.length; j++) {
        if (round1.groups[j].includes(i)) {
          groupNumber1 = j + 1;
          role1 = round1.roles[j][round1.groups[j].indexOf(i)];
          break;
        }
      }
    } else {
      groupNumber1 = "";
      role1 = "";
    }

    let groupNumber2, role2;
    if (round2) {
      for (let j = 0; j < round2.groups.length; j++) {
        if (round2.groups[j].includes(i)) {
          groupNumber2 = j + 1;
          role2 = round2.roles[j][round2.groups[j].indexOf(i)];
          break;
        }
      }
    } else {
      groupNumber2 = "";
      role2 = "";
    }

    let groupNumber3, role3;
    if (round3) {
      for (let j = 0; j < round3.groups.length; j++) {
        if (round3.groups[j].includes(i)) {
          groupNumber3 = j + 1;
          role3 = round3.roles[j][round3.groups[j].indexOf(i)];
          break;
        }
      }
    } else {
      groupNumber3 = "";
      role3 = "";
    }

    csvContent += `${i},${groupNumber1},${role1},${groupNumber2},${role2},${groupNumber3},${role3}\n`;
  }

  return csvContent;
}

// ●アニメーションと歩く音をつける ＊＊＊＊＊＊＊＊＊＊＊

function startAnimation() {
  const numParticipants = parseInt(
    document.getElementById("numParticipants").value
  );
  if (isNaN(numParticipants) || numParticipants <= 0) {
    alert("正の整数を入力してください");
    return;
  }

  const canvas = document.getElementById("canvas");
  const sound = document.getElementById("sound");
  canvas.innerHTML = ""; // 既存の図形をクリア

  const columns = 10; // 折り返し単位
  const animationSpeed = 300; // アニメーション速度(ms)と音の再生間隔
  sound.play();

  for (let i = 0; i < numParticipants; i++) {
    const circle = document.createElement("div");
    circle.className = "circle";

    const x = (i % columns) * 50;
    const y = Math.floor(i / columns) * 50;

    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;

    setTimeout(() => {
      canvas.appendChild(circle);
      sound.currentTime = 0;
      if (i === numParticipants - 1) {
        // 最後のタイミングで停止
        sound.pause();
      } else {
        sound.play();
      }
    }, i * animationSpeed);
  }
}

// 振り分け用 ＊＊＊＊＊＊＊＊＊＊＊＊＊
// 参加者用 配列
let participants = [];
// 役割
let roles = ["speaker", "listener", "observer"];
// 何回目の振り分けかのカウント用
let currentRound = 0;
// どのグループに参加することになったか
let groupAssignments = [];

// ＊＊＊ 1回目 ＊＊＊
function generateGrid() {
  const numParticipants = parseInt(
    document.getElementById("numParticipants").value
  );
  if (isNaN(numParticipants) || numParticipants % 3 !== 0) {
    alert("3の倍数を入力してください。");
    return;
  }

  const tableRows = numParticipants / 3;
  const tableCols = 3;
  let numbers = Array.from({ length: numParticipants }, (_, i) => i + 1);

  // ランダムに並べ替える
  numbers = numbers.sort(() => Math.random() - 0.5);

  // 表を生成
  // ID値 tableContainer に一致する要素を返す
  const tableContainer = document.getElementById("tableContainer");
  tableContainer.innerHTML = "";
  // 表の中身をクリア
  // document.createElement(tagName) 引数のtagNameで指定されたHTML要素を生成する
  const table = document.createElement("table"); // table要素を生成
  table.style.borderCollapse = "collapse";
  table.id = "generatedTable"; // テーブルにIDを付与
  // 表を書く
  let count = 0;
  for (let i = 0; i < tableRows; i++) {
    const row = document.createElement("tr");
    for (let j = 0; j < tableCols; j++) {
      const cell = document.createElement("td");
      cell.style.border = "1px solid black";
      cell.style.padding = "10px";
      cell.style.textAlign = "center";
      cell.innerHTML = numbers[count++];
      row.appendChild(cell); // cellの最後の要素としてrowに追加
    }
    table.appendChild(row); // rowの最後の要素としてtableに追加
  }
  tableContainer.appendChild(table); // 表をtableContainerに追加
}

// ＊＊＊ 2回目 ＊＊＊
function shiftSecondColumn() {
  const table = document.getElementById("generatedTable");
  if (!table) return;
  const rows = Array.from(table.rows);
  const secondColumnValues = rows.map((row) => row.cells[1].textContent);

  // 2列目の値を一つ下にシフト（最後の値は最初に移動）
  secondColumnValues.unshift(secondColumnValues.pop());

  // シフト後の値を2列目に設定
  rows.forEach((row, i) => {
    row.cells[1].textContent = secondColumnValues[i];
  });
}

// ＊＊＊ 3回目 ＊＊＊
function shiftThirdColumn() {
  const table = document.getElementById("generatedTable");
  if (!table) return;

  const rows = Array.from(table.rows);
  const thirdColumnValues = rows.map((row) => row.cells[2].textContent);

  // 3列目の値を一つ上にシフト（最初の値は最後に移動）
  thirdColumnValues.push(thirdColumnValues.shift());

  // シフト後の値を3列目に設定
  rows.forEach((row, i) => {
    row.cells[2].textContent = thirdColumnValues[i];
  });
}
