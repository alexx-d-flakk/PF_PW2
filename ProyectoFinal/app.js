document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#csvFileInput').addEventListener('change', handleFileSelect, false);
});

let csvData = [];

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
        const contents = e.target.result;
        csvData = CSVToArray(contents);
        displayCSV();
    };
    reader.readAsText(file);
}

function readCSV() {
    document.querySelector('#csvFileInput').click();
}

function CSVToArray(strData, strDelimiter = ",") {
    const objPattern = new RegExp(
        (
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
    );
    const arrData = [[]];
    let arrMatches = null;
    while (arrMatches = objPattern.exec(strData)) {
        const strMatchedDelimiter = arrMatches[1];
        if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter) {
            arrData.push([]);
        }
        const strMatchedValue = arrMatches[2] ?
            arrMatches[2].replace(new RegExp("\"\"", "g"), "\"") :
            arrMatches[3];
        arrData[arrData.length - 1].push(strMatchedValue);
    }
    return arrData;
}

function displayCSV() {
    const output = document.getElementById('output');
    output.innerHTML = '';
    const table = document.createElement('table');
    csvData.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });
    output.appendChild(table);
}

function showInsertForm() {
    const formContainer = document.getElementById('form-container');
    formContainer.innerHTML = `
        <h2>Insertar Datos</h2>
        <input type="text" id="newData" placeholder="Ingresa datos separados por comas">
        <button onclick="insertData()">Insertar</button>
    `;
}

function insertData() {
    const newData = document.getElementById('newData').value;
    const newRow = newData.split(',');
    csvData.push(newRow);
    displayCSV();
    document.getElementById('form-container').innerHTML = '';
}

function showDeleteForm() {
    const formContainer = document.getElementById('form-container');
    formContainer.innerHTML = `
        <h2>Borrar Datos</h2>
        <input type="number" id="rowIndex" placeholder="Índice de la fila a borrar">
        <button onclick="deleteData()">Borrar</button>
    `;
}

function deleteData() {
    const rowIndex = document.getElementById('rowIndex').value;
    if (rowIndex >= 0 && rowIndex < csvData.length) {
        csvData.splice(rowIndex, 1);
        displayCSV();
        document.getElementById('form-container').innerHTML = '';
    } else {
        alert('Índice no válido');
    }
}
