export class Matriz {
    constructor(dados) {
        this.dados = dados;
        this.linhas = dados.length;
        this.colunas = dados[0].length;
    }

    somar(outra) {
        if (this.linhas !== outra.linhas || this.colunas !== outra.colunas) {
            throw new Error("Erro: As matrizes devem possuir a mesma ordem.");
        }
        return new Matriz(this.dados.map((l, i) => l.map((v, j) => v + outra.dados[i][j])));
    }

    subtrair(outra) {
        if (this.linhas !== outra.linhas || this.colunas !== outra.colunas) {
            throw new Error("Erro: As matrizes devem possuir a mesma ordem.");
        }
        return new Matriz(this.dados.map((l, i) => l.map((v, j) => v - outra.dados[i][j])));
    }

    multiplicarEscalar(esc) {
        return new Matriz(this.dados.map(l => l.map(v => v * esc)));
    }

    multiplicar(outra) {
        if (this.colunas !== outra.linhas) {
            throw new Error("Erro Geométrico: O número de colunas da 1ª matriz deve ser igual ao número de linhas da 2ª.");
        }
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