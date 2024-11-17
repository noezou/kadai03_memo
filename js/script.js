$("main").slideDown(500);

// 参加者数
const numParticipants = document.getElementById("numParticipants");
// 参加者数を3で割った整数値＝グループの数＝表の行数
const group_num = Math.floor(numParticipants / 3);
// グループの最大人数＝表の列数＝4 参加者が3の倍数でなかった場合は、observerに1人ずつ加え4人1組とする。
const group_size_max = 4;
const group_size = 3; // 今はまだ、3で割り切れる参加者数で検討
// 余りを算出する （0,1,2のいずれかになる）
const remainder = numParticipants % 3;

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

  // localStorageの中にinitialValueという名前が存在していれば、
  if (localStorage.getItem("numberArray")) {
    // numberArrayがあれば値を取得して、変数valueに代入する
    value = JSON.parse(localStorage.getItem("numberArray"));
    // 変数valueの中身をdiv(ID initialValue)に表示する
    $("#initialValueP").append(value);
  }
}

$("#clearArray_0").on("click", function () {
  //localStorageの"numberArray"という名前の中身を削除する
  localStorage.removeItem("numberArray");
  alert("初期値を削除しました");
  document.getElementById("initialValueP").innerHTML = "";
  // numParticipantsを空文字で上書きする;
  $("#numParticipants").val("");
});

// 読み込み
// for (let i = 0; i < localStorage.length; i++) {
//   const key = localStorage.key(i);
//   const value = localStorage.getItem(key);
//   const html = `
//       <li>
//         <p>${key}</p>
//         <p>${value}</p><br>
//       </li>
//     `;
//   $("#firstValue").append(html);
// }

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
