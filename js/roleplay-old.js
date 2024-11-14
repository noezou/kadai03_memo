$("main").slideDown(500);

//1.Save クリックイベント
$("#save").on("click", function () {
  const value = $("#text_area").val(); //text_areaの値（Value）を取得 → 変数valueに代入
  localStorage.setItem("memo", value); //localStorageに"memo"という名前をつけて、変数valueの中身をセットする
  alert("保存しました");
});

//2.clear クリックイベント
$("#clear").on("click", function () {
  localStorage.removeItem("memo"); //localStorageの"memo"という名前の中身を削除する
  alert("削除しました");
  $("#text_area").val(""); //text_areaを空文字で上書きする
});

//3.ページ読み込み：保存データ取得表示
// localStorageの中にmemoという名前が存在していれば、
if (localStorage.getItem("memo")) {
  // memoがあれば、memoから値を取得して、変数valueに代入する
  const value = localStorage.getItem("memo");
  // 変数valueの中身をtext_areaに表示する
  $("#text_area").val(value);
}

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
console.log("配列としてのnumbers初期値：", numbers);

//
// let participants = [];

// ナンバーをFisher–Yates shuffle法でランダムに並べ替える

// let len = array.length;
for (let i = numbers - 1; i > 0; i--) {
  let j = Math.floor(Math.random() * (i + 1));
  let tmp = array[i];
  array[i] = array[j];
  array[j] = tmp;
}

// numbers = numbers.sort(() => Math.random() - 0.5);

console.log("ランダムに入れ替えた後のnumbers：", numbers);

// 数字の並びを、配列に入れる
let count = 0;

for (let j = 0; j < group_size_max; j++) {
  const cell = numbers[count++];
}

// 関数
// function generateGrid() {

//   // ＊＊＊表を生成＊＊＊
//   // ID値 tableContainer に一致する要素を返す
//   const tableContainer = document.getElementById("tableContainer");
//   tableContainer.innerHTML = ""; // 表の中身をクリア
// document.createElement(tagName) 引数のtagNameで指定されたHTML要素を生成する

// const table = document.createElement("table"); // table要素を生成
// table.style.borderCollapse = "collapse";
// table.id = "generatedTable"; // テーブルにIDを付与

// 表を書く
//   let count = 0;
//   for (let i = 0; i < group_num; i++) {
//     const row = document.createElement("tr");
//     for (let j = 0; j < group_size_max; j++) {
//       const cell = document.createElement("td");
//       cell.style.border = "1px solid black";
//       cell.style.padding = "10px";
//       cell.style.textAlign = "center";
//       cell.innerHTML = numbers[count++];
//       row.appendChild(cell); // cellの最後の要素としてrowに追加
//     }
//     table.appendChild(row); // rowの最後の要素としてtableに追加
//   }
//   tableContainer.appendChild(table); // 表をtableContainerに追加
// }

// 2回目
function shiftSecondColumn() {
  // ID値 tableContainer2 に一致する要素を返す
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
