// Executa automaticamente assim que a página e os elementos HTML terminarem de carregar
window.addEventListener('DOMContentLoaded', () => {
    // Ajusta o alinhamento do container principal
    document.getElementById('main-container').style.alignItems = 'flex-start';

    // Garante que a barra de navegação fique visível
    document.getElementById('main-nav').style.display = 'flex';

    // Seleciona o primeiro botão da navbar (Adição / Subtração) e ativa a tela dele
    const primeiroBotaoNav = document.querySelectorAll('.nav-btn')[0];
    if (primeiroBotaoNav) {
        primeiroBotaoNav.classList.add('active'); // Deixa o botão destacado
        initScreen('bas'); // Inicializa o grid de matrizes da primeira tela
    }
});

// Daqui para baixo, o seu código continua exatamente igual (Class Matriz, openScreen, etc...)
class Matriz {
    constructor(dados) {
        this.dados = dados;
        this.linhas = dados.length;
        this.colunas = dados[0].length;
    }

    somar(outra) {
        if (this.linhas !== outra.linhas || this.colunas !== outra.colunas) throw new Error("Erro: As matrizes devem possuir a mesma ordem.");
        return new Matriz(this.dados.map((l, i) => l.map((v, j) => v + outra.dados[i][j])));
    }

    subtrair(outra) {
        if (this.linhas !== outra.linhas || this.colunas !== outra.colunas) throw new Error("Erro: As matrizes devem possuir a mesma ordem.");
        return new Matriz(this.dados.map((l, i) => l.map((v, j) => v - outra.dados[i][j])));
    }

    multiplicarEscalar(esc) {
        return new Matriz(this.dados.map(l => l.map(v => v * esc)));
    }

    multiplicar(outra) {
        if (this.colunas !== outra.linhas) throw new Error("Erro Geométrico: O número de colunas da 1ª matriz deve ser igual ao número de linhas da 2ª.");
        let res = [];
        for (let i = 0; i < this.linhas; i++) {
            let lin = [];
            for (let j = 0; j < outra.colunas; j++) {
                let s = 0;
                for (let k = 0; k < this.colunas; k++) s += this.dados[i][k] * outra.dados[k][j];
                lin.push(s);
            }
            res.push(lin);
        }
        return new Matriz(res);
    }

    determinante() {
        const n = this.linhas, m = this.dados;
        if (n !== this.colunas) throw new Error("Restrição Estrutural: Determinante aplicável apenas a matrizes quadradas.");
        if (n === 1) return m[0][0];
        if (n === 2) return (m[0][0] * m[1][1]) - (m[0][1] * m[1][0]);
        if (n === 3) return ((m[0][0]*m[1][1]*m[2][2]) + (m[0][1]*m[1][2]*m[2][0]) + (m[0][2]*m[1][0]*m[2][1])) - ((m[0][2]*m[1][1]*m[2][0]) + (m[0][0]*m[1][2]*m[2][1]) + (m[0][1]*m[1][0]*m[2][2]));
        
        let det = 0;
        for (let c = 0; c < n; c++) {
            const sub = m.slice(1).map(l => l.filter((_, idx) => idx !== c));
            const sinal = (c % 2 === 0) ? 1 : -1;
            det += sinal * m[0][c] * new Matriz(sub).determinante();
        }
        return det;
    }

    resolverGauss() {
        let n = this.linhas, m = this.colunas;
        if (m <= n) throw new Error("Formato Incorreto: Insira uma matriz ampliada válida (Termos independentes na última coluna).");
        let mat = this.dados.map(l => [...l]);

        for (let i = 0; i < n; i++) {
            let maxRow = i;
            for (let k = i + 1; k < n; k++) if (Math.abs(mat[k][i]) > Math.abs(mat[maxRow][i])) maxRow = k;
            [mat[i], mat[maxRow]] = [mat[maxRow], mat[i]];
            
            if (Math.abs(mat[i][i]) < 1e-10) continue; 
            
            for (let k = i + 1; k < n; k++) {
                let fator = mat[k][i] / mat[i][i];
                for (let j = i; j < m; j++) mat[k][j] -= fator * mat[i][j];
            }
        }

        let res = new Array(n).fill(0), isSPI = false, isSI = false;
        for (let i = n - 1; i >= 0; i--) {
            let z = true;
            for (let j = 0; j < m - 1; j++) if (Math.abs(mat[i][j]) > 1e-10) z = false;
            
            if (z) {
                if (Math.abs(mat[i][m - 1]) > 1e-10) { isSI = true; break; }
                else isSPI = true;
            } else {
                let soma = 0;
                for (let j = i + 1; j < m - 1; j++) soma += mat[i][j] * res[j];
                res[i] = (mat[i][m - 1] - soma) / mat[i][i];
            }
        }

        if (isSI) return "🔴 <b>Sistema Impossível (SI)</b><br>As equações geram uma contradição. Não há solução.";
        if (isSPI) return "🟡 <b>Sistema Possível Indeterminado (SPI)</b><br>O sistema possui infinitas soluções ao longo de um plano/reta.";
        
        let txt = "🟢 <b>Sistema Possível Determinado (SPD)</b><br><br>";
        for(let i=0; i<n; i++) txt += `x<sub>${i+1}</sub> = <b>${parseFloat(res[i].toFixed(4))||0}</b> &nbsp;&nbsp;&nbsp;`;
        return txt;
    }
}

function openScreen(screenId, btnElement) {
    document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
    
    document.getElementById(screenId).classList.add('active');
    btnElement.classList.add('active');

    const prefix = screenId.split('-')[1];
    const map = { 'basicas': 'bas', 'escalar': 'esc', 'mult': 'mul', 'det': 'det', 'gauss': 'gau' };
    initScreen(map[prefix]);
}

function initScreen(prefix) {
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

function createGridHTML(containerId, rows, cols) {
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

function getMatrixFromUI(gridId, rows, cols) {
    let dados = [];
    for (let i = 0; i < rows; i++) {
        let linha = [];
        for (let j = 0; j < cols; j++) {
            linha.push(parseFloat(document.getElementById(`${gridId}_${i}_${j}`).value) || 0);
        }
        dados.push(linha);
    }
    return new Matriz(dados);
}

function renderOutput(resultado, divId) {
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

function showError(prefix, msg) {
    const errDiv = document.getElementById(`${prefix}_error`);
    errDiv.innerHTML = msg;
    errDiv.classList.remove('hidden');
}

function hideError(prefix) {
    const errDiv = document.getElementById(`${prefix}_error`);
    errDiv.classList.add('hidden');
    errDiv.innerHTML = "";
}

function calcular(operacao, prefix) {
    hideError(prefix);
    const resultDiv = `${prefix}_result`;
    
    try {
        let mA, mB, res;

        if (prefix === 'bas') {
            let r = parseInt(document.getElementById('bas_rows').value);
            let c = parseInt(document.getElementById('bas_cols').value);
            mA = getMatrixFromUI('bas_gridA', r, c);
            mB = getMatrixFromUI('bas_gridB', r, c);
        } else if (prefix === 'esc') {
            mA = getMatrixFromUI('esc_gridA', parseInt(document.getElementById('esc_rows').value), parseInt(document.getElementById('esc_cols').value));
        } else if (prefix === 'mul') {
            mA = getMatrixFromUI('mul_gridA', parseInt(document.getElementById('mul_rowsA').value), parseInt(document.getElementById('mul_colsA').value));
            mB = getMatrixFromUI('mul_gridB', parseInt(document.getElementById('mul_rowsB').value), parseInt(document.getElementById('mul_colsB').value));
        } else if (prefix === 'det') {
            let ord = parseInt(document.getElementById('det_ordem').value);
            mA = getMatrixFromUI('det_gridA', ord, ord);
        } else if (prefix === 'gau') {
            mA = getMatrixFromUI('gau_gridA', parseInt(document.getElementById('gau_rows').value), parseInt(document.getElementById('gau_cols').value));
        }

        switch(operacao) {
            case 'soma': res = mA.somar(mB); break;
            case 'sub': res = mA.subtrair(mB); break;
            case 'escalar': 
                const val = parseFloat(document.getElementById('esc_val').value) || 0;
                res = mA.multiplicarEscalar(val); 
                break;
            case 'mult': res = mA.multiplicar(mB); break;
            case 'det': 
                let detVal = mA.determinante();
                res = `det(A) = ${parseFloat(detVal.toFixed(4))}`; 
                break;
            case 'gauss': res = mA.resolverGauss(); break;
        }

        renderOutput(res, resultDiv);

    } catch (error) {
        showError(prefix, error.message);
        document.getElementById(resultDiv).innerHTML = `<span style="color: var(--error-color);">Falha na operação. Verifique as restrições indicadas no erro acima.</span>`;
    }
}