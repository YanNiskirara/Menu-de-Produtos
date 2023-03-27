// selecionando elementos do html
const container = document.querySelector('.container');
const titulo = document.querySelector('.titulo');
const formulario = document.querySelector('.formulario');
const erros = document.querySelector('.erros');
const tabela = document.querySelector('.tabela-menu');

let contProdutos = 0;
let Produtos = {};

// Funções geradoras

function criaBotao(msg) {
    const botao = document.createElement('button');
    botao.innerText = msg;
    formulario.appendChild(botao);
}

function criaH1(msg) {
    const h1 = document.createElement('h1');
    h1.innerHTML = msg;
    h1.classList.add('cadastro-titulo');
    titulo.appendChild(h1);
}

function criaInput(texto, classe, placeholder) {
    const par = document.createElement('p');
    const input = document.createElement('input');
    par.innerText = texto;
    input.classList.add(classe);
    input.placeholder = placeholder;
    par.appendChild(input);
    formulario.appendChild(par);
}

function criaProduto(codigo, descricao, qntminima, qntatual, fornecedor) {
    const produto = {codigo,descricao,qntminima,qntatual,fornecedor };
    return produto;
}

function criaErro(msg) {
    resetFull(erros);
    const erro = document.createElement('div');
    erro.classList.add('box-erro');
    erro.innerText = msg;
    erros.appendChild(erro);
}

function criaBoxProdutoCodigo(produto){
    resetFull(erros);
    const box = document.createElement('div');
    box.classList.add('box-produto');
    box.innerText = `Produto: ${produto.descricao}`;
    erros.appendChild(box);
}

function criaBoxProdutoEstoque(produto){
    resetFull(erros);
    const box = document.createElement('div');
    box.classList.add('box-produto-disponivel');
    box.innerText = `Produto: ${produto.descricao}\nDisponível para venda! Prossiga com a compra na aba lateral.`;
    erros.appendChild(box);
}

function criaBoxProdutoVenda(produto){
    resetFull(erros);
    const box = document.createElement('div');
    box.classList.add('box-produto-vendido');
    box.innerText = `Quantidade do produto "${produto.descricao}" em estoque: ${produto.qntatual}`;
    erros.appendChild(box);
}

// Funções analistas

function produtoExiste(codigo){
    for(let i = 0; i < contProdutos; i++){
        if(Produtos[i].codigo === codigo ){
            return true;
        }   
    }
    return false;
}

function getProdutoByCodigo(codigo){
    for(let i = 0; i < contProdutos; i++){
        if(Produtos[i].codigo === codigo){
            return Produtos[i];
        }
    }
}

function disponivelVenda(produto, quantidadeDesejada){
    const quantidade = produto.qntatual;
    if(quantidade < quantidadeDesejada){
        return false;
    }
    return true;
}

function produtoRepetido(codigo){
    for(let i in Produtos){
        if(Produtos[i].codigo === codigo){
            return true;
        }
    }
    return false;
}

// Funções reset

function replaceForm(formularioDesejado){
    const classeAtual = formulario.getAttribute('class');
    formulario.classList.replace(`${classeAtual}`, `${formularioDesejado}`);
}

function resetFull(elemento){
    elemento.innerHTML = '';
}

function resetAll(){
    titulo.innerHTML = '';
    formulario.innerHTML = '';
    erros.innerHTML = '';
}

// Listener de click
document.addEventListener('click', function (e) {
    const evento = e.target;

    if (evento.classList.contains('cadastro')) {
        resetAll();
        replaceForm('formulario-cadastro');
        criaH1('Informe os seguintes dados do produto:');
        criaInput('Código: ', 'input-codigo', 'Ex: 123456789 ');
        criaInput('Descrição: ', 'input-descricao', 'Ex: Sabonete em barra');
        criaInput('Qnt. Mínima:  ', 'input-quantmin', 'Ex: 2');
        criaInput('Qnt. atual:  ', 'input-quantatual', 'Ex: 1500');
        criaInput('Fornecedor:  ', 'input-fornecedor', 'Ex: Amazon');
        criaBotao('Enviar');
    }
    if (evento.classList.contains('codigo')) {
        resetAll();
        replaceForm('formulario-codigo');
        criaH1('Informe o código do produto:');
        criaInput('Código: ', 'input-codigo', 'Ex: 7418529630 ');
        criaBotao('Enviar');
    }
    if (evento.classList.contains('estoque')) {
        resetAll();
        replaceForm('formulario-estoque');
        criaH1('Informe o código do produto');
        criaInput('Código: ', 'input-codigo', 'Ex: 9876543210 ');
        criaH1('e a quantidade desejada:');
        criaInput('Quantidade: ', 'input-quantidade', 'Ex: 10');
        criaBotao('Enviar');
    }
    if (evento.classList.contains('venda')) {
        resetAll();
        replaceForm('formulario-venda');
        criaH1('Informe o código do produto');
        criaInput('Código: ', 'input-codigo', 'Ex: 3541260897 ');
        criaH1('e a quantidade desejada:');
        criaInput('Quantidade: ', 'input-quantidade', 'Ex: 10');
        criaBotao('Enviar');
    }
    if (evento.classList.contains('encerrar')) {
        replaceForm('formulario');
        resetAll();
        this.location.reload();
    }

})

// Listener de submit
document.addEventListener('submit', function (e) {

    const evento = e.target;
    e.preventDefault();

    if(evento.classList.contains('formulario-cadastro')){

        // resets 
        resetFull(erros);

        // selecionando os inputs e valores
        const inputCodigo = evento.querySelector('.input-codigo');
        const inputDescricao = evento.querySelector('.input-descricao');
        const inputQuantMin = evento.querySelector('.input-quantmin');
        const inputQuantAtual = evento.querySelector('.input-quantatual');
        const inputFornecedor = evento.querySelector('.input-fornecedor');

        const Codigo = inputCodigo.value;
        const Descricao = inputDescricao.value;
        const QuantMin = Number(inputQuantMin.value);
        const QuantAtual = Number(inputQuantAtual.value);
        const Fornecedor = inputFornecedor.value;

        // script
        if (QuantMin > QuantAtual) {
            alert('PRODUTO NÃO CADASTRADO');
            criaErro('Quantidade de estoque menor do que quantidade mínima.');
            const inputs = evento.querySelectorAll('input');
            inputs.forEach(input => input.value = '');
            return 0;
        }
        if(contProdutos === 10){
            alert('PRODUTO NÃO CADASTRADO');
            criaErro('Quantidade máxima de produtos cadastrados atingida.');
            const inputs = evento.querySelectorAll('input');
            inputs.forEach(input => input.value = '');
            return 0;
        }
        if(produtoRepetido(Codigo)){
            alert('PRODUTO NÃO CADASTRADO');
            criaErro('Código já cadastrado.');
            const inputs = evento.querySelectorAll('input');
            inputs.forEach(input => input.value = '');
            return 0;
        }   
        alert('PRODUTO CADASTRADO COM SUCESSO!');
        
        // criando produto 

        Produtos[contProdutos] = criaProduto(Codigo, Descricao, QuantMin, QuantAtual, Fornecedor);
        contProdutos++;

        const inputs = evento.querySelectorAll('input');
        inputs.forEach(input => input.value = '');
    }
    if(evento.classList.contains('formulario-codigo')){

        // resets
        resetFull(erros);

        // selecionando inputs e valores
        const inputCodigo = evento.querySelector('.input-codigo');
        const codigo = inputCodigo.value;
        
        // script
        if(!produtoExiste(codigo)){
            alert('PRODUTO NÃO ENCONTRADO');
            criaErro('Produto não encontrado ou inexistente. Por favor, verifique a ortografia e tente novamente.');
            const inputs = evento.querySelectorAll('input');
            inputs.forEach(input => input.value = '');
            return 0;
        }else{
            const produto = getProdutoByCodigo(codigo);
            criaBoxProdutoCodigo(produto);
            const inputs = evento.querySelectorAll('input');
            inputs.forEach(input => input.value = '');
            return 0;
        }
    }
    if(evento.classList.contains('formulario-estoque')){

        // resets
        resetFull(erros);

        // selecionando inputs e valores
        const inputCodigo = evento.querySelector('.input-codigo');
        const inputQuantidade = evento.querySelector('.input-quantidade');
        const quantidade = Number(inputQuantidade.value);
        const codigo = inputCodigo.value;

        // script
        if(!produtoExiste(codigo)){
            alert('PRODUTO NÃO ENCONTRADO')
            criaErro('Produto não encontrado ou inexistente. Por favor, verifique a ortografia e tente novamente.');
            const inputs = evento.querySelectorAll('input');
            inputs.forEach(input => input.value = '');
            return 0;
        }else{
            resetFull(erros);
            const produto = getProdutoByCodigo(codigo);

            if(disponivelVenda(produto, quantidade)){
                criaBoxProdutoEstoque(produto);
                const inputs = evento.querySelectorAll('input');
                inputs.forEach(input => input.value = '');
                return 0;
            }else{
                alert('PRODUTO INDISPONÍVEL');
                criaErro('Quantidade desejada excedeu o estoque.');
                const inputs = evento.querySelectorAll('input');
                inputs.forEach(input => input.value = '');
                return 0;
            }
        }
        
    }
    if(evento.classList.contains('formulario-venda')){

        // resets
        resetFull(erros);

        // variáveis
        const inputCodigo = evento.querySelector('.input-codigo');
        const codigo = inputCodigo.value;
        const inputQuantidade = evento.querySelector('.input-quantidade');
        const quantidade = inputQuantidade.value;
        const produto = getProdutoByCodigo(codigo);

        // script
        if(!produtoExiste(codigo)){
            alert('PRODUTO NÃO ENCONTRADO');
            criaErro('Produto não encontrado ou inexistente. Por favor, verifique a ortografia e tente novamente.');
            const inputs = evento.querySelectorAll('input');
            inputs.forEach(input => input.value = '');
            return 0;
        }
        else if(!disponivelVenda(produto, quantidade)){
            alert('INDISPONÍVEL');
            criaErro('Quantidade desejada excedeu o estoque.');
            const inputs = evento.querySelectorAll('input');
            inputs.forEach(input => input.value = '');
            return 0;
        }
        else if(produto.qntatual === 0){
            alert('PRODUTO ESGOTADO');
            criaErro('Estoque do produto esgotado.');
            const inputs = evento.querySelectorAll('input');
            inputs.forEach(input => input.value = '');
            return 0;
        }
        else{
            produto.qntatual -= quantidade;
             alert('VENDA EFETIVADA!');
             criaBoxProdutoVenda(produto);
             const inputs = evento.querySelectorAll('input');
             inputs.forEach(input => input.value = '');
             return 0;
        }
    }
})
