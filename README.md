# Relatório do Trabalho PLA

## 1. Introdução

Este documento apresenta o projeto desenvolvido para a disciplina de Programação Linear e Álgebra (PLA). O objetivo principal do trabalho é implementar um sistema web simples capaz de realizar operações em matrizes e calcular determinantes por meio de eliminação de Gauss.

## 2. Objetivos

- Implementar operações básicas de matrizes.
- Calcular determinantes utilizando eliminação de Gauss.
- Criar uma interface web que permita a entrada de dados pelo usuário.
- Disponibilizar resultados de forma clara e acessível.

## 3. Metodologia

O projeto foi construído utilizando tecnologia web básica: HTML, CSS e JavaScript. A lógica matemática foi desenvolvida em JavaScript e organizada em módulos para separar a camada de cálculo da camada de interface.

A abordagem geral incluiu:

- criação de uma interface responsiva para entrada e visualização de matrizes;
- desenvolvimento de funções para manipulação de matrizes e cálculo de determinantes;
- uso de eliminação de Gauss para transformar matrizes em forma triangular e extrair o determinante.

## 4. Estrutura do projeto

- `index.html` - página principal da aplicação, que carrega a interface e os scripts necessários.
- `styles/styles.css` - estilos visuais da aplicação, incluindo layout e formatação de elementos.
- `js/script.js` - lógica principal de interação e conexão entre a interface e os serviços.
- `js/service/matriz.js` - funções de cálculo relacionadas a matrizes e determinantes.
- `js/ui/ui.js` - manipuladores de interface responsáveis pela renderização de elementos e pela captura de entrada do usuário.

## 5. Operações e algoritmos

### 5.1. Operações Elementares (Aritmética de Matrizes)

Esta categoria agrupa funções focadas em manipulações algébricas básicas. Três delas utilizam programação funcional para garantir a imutabilidade dos dados originais, retornando sempre uma nova matriz.

- `multiplicarEscalar(esc)`
  - Objetivo: Multiplica cada elemento da matriz por um número constante (escalar).
  - Como funciona: utiliza um `map()` aninhado. O primeiro percorre as linhas (`l`) e o segundo percorre os valores individuais (`v`) de cada linha, multiplicando-os por `esc`.
  - Complexidade temporal: `O(m × n)`, onde `m` é o número de linhas e `n` o número de colunas.

- `somar(outra)`
  - Objetivo: Realiza a adição elemento a elemento entre a matriz atual (`this`) e uma matriz secundária (`outra`).
  - Validação: verifica se as dimensões (linhas e colunas) de ambas as matrizes são idênticas. Caso contrário, lança um erro de ordem.
  - Como funciona: mapeia as linhas e elementos usando o índice da linha (`i`) e do elemento (`j`) para acessar e somar a posição correspondente em `outra`.

- `subtrair(outra)`
  - Objetivo: Realiza a subtração elemento a elemento entre as duas matrizes.
  - Validação: mesma checagem estrutural de ordem idêntica da função de soma.
  - Como funciona: segue a mesma lógica da função `somar`, apenas substituindo o operador de adição (`+`) pelo de subtração (`-`).

### 5.2. Operações Avançadas e Algoritmos

Esta categoria engloba operações estruturais e resoluções de sistemas lineares que exigem loops aninhados e lógica condicional.

- `multiplicar(outra)`
  - Objetivo: realiza a multiplicação matricial clássica (produto de duas matrizes).
  - Validação: garante a propriedade geométrica essencial: o número de colunas da primeira matriz (`this.colunas`) deve ser igual ao número de linhas da segunda (`outra.linhas`).
  - Como funciona: utiliza três loops `for` aninhados:
    - o primeiro (`i`) varre as linhas da primeira matriz;
    - o segundo (`j`) varre as colunas da segunda matriz;
    - o terceiro (`k`) calcula o produto escalar entre a linha `i` e a coluna `j`, acumulando o valor em `s` antes de adicioná-lo à nova matriz.
  - Complexidade temporal: algoritmo cúbico tradicional `O(m × n × p)`.

- `determinante()`
  - Objetivo: calcula o determinante de uma matriz quadrada.
  - Validação: restringe a execução apenas se `linhas === colunas`.
  - Casos base otimizados:
    - ordem `1x1`: retorna o único elemento;
    - ordem `2x2`: multiplicação cruzada da diagonal principal menos a secundária;
    - ordem `3x3`: implementação manual pela regra de Sarrus.
  - Caso geral (`ordem > 3`): implementa o Teorema de Laplace (expansão por cofatores) de forma recursiva. Extrai submatrizes removendo a primeira linha e a coluna `c` atual via `.slice(1)` e `.filter()`, calculando o determinante da submatriz recursivamente.

- `resolverGauss()`
  - Objetivo: resolve um sistema de equações lineares a partir de uma matriz ampliada `[A|b]` utilizando eliminação de Gauss com pivotamento parcial.
  - Validação: verifica se o formato é de uma matriz ampliada válida (o número de colunas deve ser maior que o de linhas).
  - Etapas do algoritmo:
    - pivotamento parcial: procura a linha com o maior valor absoluto na coluna atual e troca com a linha pivot para evitar divisões por zero e reduzir erros de arredondamento;
    - eliminação: transforma a matriz em uma matriz triangular superior aplicando o fator de eliminação nas linhas inferiores;
    - substituição retroativa: resolve as variáveis da última equação para a primeira.
  - Análise de consistência do sistema: avalia linhas zeradas para classificar o sistema em três cenários visuais com tags HTML e emojis:
    - 🔴 SI (Sistema Impossível): linha de coeficientes zerada e termo independente diferente de zero (`0 = constante`);
    - 🟡 SPI (Sistema Possível Indeterminado): linha inteira zerada, indicando infinitas soluções;
    - 🟢 SPD (Sistema Possível Determinado): solução única.
  - Resultado: formata os valores finais com 4 casas decimais (`toFixed(4)`).

## 6. Resultado esperado

O sistema permite ao usuário inserir os valores de uma matriz, executar cálculos e visualizar o resultado do determinante. A aplicação é adequada para demonstrações didáticas e apoio ao estudo de operações matriciais.

## 6. Uso

1. Abra o arquivo `index.html` em um navegador moderno.
2. Insira os valores da matriz na interface.
3. Solicite o cálculo do determinante.
4. Verifique o resultado exibido na tela.

## 7. Considerações finais

O projeto demonstra a aplicação de conceitos de álgebra linear em um ambiente web simples. A separação entre lógica de cálculo e interface facilita futuras manutenções e melhorias, como a inclusão de novas operações matriciais ou validações adicionais.

