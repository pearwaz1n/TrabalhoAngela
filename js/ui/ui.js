export function openScreen(screenId, btnElement) {
    document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
    
    document.getElementById(screenId).classList.add('active');
    btnElement.classList.add('active');

    const prefix = screenId.split('-')[1];
    const map = { 'basicas': 'bas', 'escalar': 'esc', 'mult': 'mul', 'det': 'det', 'gauss': 'gau' };
    initScreen(map[prefix]);
}

export function initScreen(prefix) {
    hideError(prefix);
    document.getElementById(`${prefix}_result`).innerHTML = `<span style="color: var(--text-muted);">Aguardando operação...</span>`;

    let rA, cA, rB, cB;

    if (prefix === 'bas') {
        rA = rB = parseInt(document.getElementById('bas_rows').value);
        cA = cB = parseInt(document.getElementById('bas_cols').value);
    } else if (prefix === 'esc') {
        rA = parseInt(document.getElementById('esc_rows').value);
        cA = parseInt(document.getElementById('esc_cols').value);
    } else if (prefix === 'gau') {
        rA = parseInt(document.getElementById('gau_rows').value);
        cA = parseInt(document.getElementById('gau_cols').value);
    } else if (prefix === 'mul') {
        rA = parseInt(document.getElementById('mul_rowsA').value);
        cA = parseInt(document.getElementById('mul_colsA').value);
        rB = parseInt(document.getElementById('mul_rowsB').value);
        cB = parseInt(document.getElementById('mul_colsB').value);
    } else if (prefix === 'det') {
        rA = cA = parseInt(document.getElementById('det_ordem').value);
    }

    createGridHTML(`${prefix}_gridA`, rA, cA);
    if (document.getElementById(`${prefix}_gridB`)) createGridHTML(`${prefix}_gridB`, rB, cB);
}

export function createGridHTML(containerId, rows, cols) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const input = document.createElement('input');
            input.type = "number";
            input.step = "any";
            input.value = (i === j && cols === rows) ? 1 : 0; 
            input.id = `${containerId}_${i}_${j}`;
            input.addEventListener("focus", function() { this.select(); });
            
            container.appendChild(input);
        }
    }
}

export function renderOutput(resultado, divId) {
    const container = document.getElementById(divId);
    if (typeof resultado === 'string' || typeof resultado === 'number') {
        container.innerHTML = `<div class="text-result">${resultado}</div>`;
        return;
    }
    let html = '<table class="matrix-table">';
    resultado.dados.forEach(linha => {
        html += '<tr>' + linha.map(v => `<td>${v}</td>`).join('') + '</tr>';
    });
    html += '</table>';
    container.innerHTML = html;
}

export function showError(prefix, msg) {
    const errDiv = document.getElementById(`${prefix}_error`);
    errDiv.innerHTML = msg;
    errDiv.classList.remove('hidden');
}

export function hideError(prefix) {
    const errDiv = document.getElementById(`${prefix}_error`);
    errDiv.classList.add('hidden');
    errDiv.innerHTML = "";
}