import { Matriz } from "./service/matriz.js";
import {
    createGridHTML,
    hideError,
    initScreen,
    openScreen,
    renderOutput,
    showError
} from "./ui/ui.js";

// 1. Inicialização automática do App ao abrir a página
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('main-container').style.alignItems = 'flex-start';
    document.getElementById('main-nav').style.display = 'flex';

    const primeiroBotaoNav = document.querySelectorAll('.nav-btn')[0];
    if (primeiroBotaoNav) {
        primeiroBotaoNav.classList.add('active');
        initScreen('bas');
    }
});

// 2. Coleta estruturada de dados numéricos da Interface
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

// 3. Orquestrador Principal de Operações
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

// 4. EXPOSIÇÃO GLOBAL (Indispensável para os listeners `onclick` do HTML continuarem funcionando)
window.openScreen = openScreen;
window.initScreen = initScreen;
window.calcular = calcular;