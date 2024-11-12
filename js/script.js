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
