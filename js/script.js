const tabuleiro = document.querySelector('.tabuleiro');
const elementoPontos = document.querySelector('.pontos');
const elementoRecorde = document.querySelector('.recorde');
const controls = document.querySelectorAll('.controls i');

let fimDeJogo = false;
let comidaX, comidaY;
let cobraX = 5, cobraY = 5;
let velocidadeX = 0, velocidadeY = 0;
let cobraCorpo = [];
let intervaloId;
let pontos = 0;

// Obter recorde do armazenamento local
let recorde = localStorage.getItem('recorde') || 0;
elementoRecorde.innerText = `Recorde: ${recorde}`;

// Atualizar posição da comida
const atualizaComidaPosicao = () => {
    comidaX = Math.floor(Math.random() * 30) + 1;
    comidaY = Math.floor(Math.random() * 30) + 1;
};

const tratarFimDeJogo = () => {
    clearInterval(intervaloId);
    alert("Fim de Jogo! Clique Ok para jogar novamente...");
    location.reload();
};

// Mudar direção da cobra com base na tecla pressionada
const mudarDirecao = (e) => {
    if (e.key === "ArrowUp" && velocidadeY !== 1) {
        velocidadeX = 0;
        velocidadeY = -1;
    } else if (e.key === "ArrowDown" && velocidadeY !== -1) {
        velocidadeX = 0;
        velocidadeY = 1;
    } else if (e.key === "ArrowLeft" && velocidadeX !== 1) {
        velocidadeX = -1;
        velocidadeY = 0;
    } else if (e.key === "ArrowRight" && velocidadeX !== -1) {
        velocidadeX = 1;
        velocidadeY = 0;
    }
};

// Mudar direção ao clicar nos botões de controle
controls.forEach(button => button.addEventListener("click", () => mudarDirecao({ key: button.dataset.key })));

const iniciarJogo = () => {
    if (fimDeJogo) return tratarFimDeJogo();
    
    let html = `<div class="food" style="grid-area: ${comidaY} / ${comidaX}"></div>`;

    // Quando a cobra come a comida
    if (cobraX === comidaX && cobraY === comidaY) {
        atualizaComidaPosicao();
        cobraCorpo.push([comidaY, cobraX]);
        pontos++;
        recorde = pontos >= recorde ? pontos : recorde;
        
        localStorage.setItem('recorde', recorde);
        elementoPontos.innerText = `Pontos: ${pontos}`;
        elementoRecorde.innerText = `Recorde: ${recorde}`;
    }

    // Atualizar posição da cabeça da cobra
    cobraX += velocidadeX;
    cobraY += velocidadeY;

    for (let i = cobraCorpo.length - 1; i > 0; i--) {
        cobraCorpo[i] = [...cobraCorpo[i - 1]];
    }

    cobraCorpo[0] = [cobraX, cobraY];

    // Verificar colisão com as paredes
    if (cobraX <= 0 || cobraX > 30 || cobraY <= 0 || cobraY > 30) {
        fimDeJogo = true;
    }

    // Adicionar partes do corpo da cobra
    for (let i = 0; i < cobraCorpo.length; i++) {
        html += `<div class="head" style="grid-area: ${cobraCorpo[i][1]} / ${cobraCorpo[i][0]}"></div>`;
        
        // Verificar colisão com o próprio corpo
        if (i !== 0 && cobraCorpo[0][0] === cobraCorpo[i][0] && cobraCorpo[0][1] === cobraCorpo[i][1]) {
            fimDeJogo = true;
        }
    }

    tabuleiro.innerHTML = html;
};

atualizaComidaPosicao();
intervaloId = setInterval(iniciarJogo, 100);
document.addEventListener('keyup', mudarDirecao);
