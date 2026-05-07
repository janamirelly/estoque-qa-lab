const produtos = [
  {
    id: 1,
    nome: "Camiseta Básica",
    sku: "CAM-AMARELO-M",
    variacao: "Amarelo / M",
    quantidade: 18,
    estoqueMinimo: 10,
  },
  {
    id: 2,
    nome: "Camiseta Básica",
    sku: "CAM-BRANCO-M",
    variacao: "Branco / M",
    quantidade: 7,
    estoqueMinimo: 10,
  },
  {
    id: 3,
    nome: "Calça Jeans",
    sku: "CAL-AZUL-M",
    variacao: "Azul / M",
    quantidade: 0,
    estoqueMinimo: 10,
  },
  {
    id: 4,
    nome: "Vestido Midi",
    sku: "VES-PRETO-P",
    variacao: "Preto / P",
    quantidade: 12,
    estoqueMinimo: 10,
  },
];

let movimentacoes = [
  {
    produto: "Camiseta",
    sku: "CAM-AMARELO-M",
    tipo: "ENTRADA",
    quantidade: 20,
    motivo: "Compra",
    data: "2026-05-06 09:20",
  },
  {
    produto: "Calça Jeans",
    sku: "CAJ-AZUL-M",
    tipo: "SAIDA",
    quantidade: 3,
    motivo: "Venda",
    data: "2026-05-06 10:35",
  },
];

let produtoSelecionado = null;

document.addEventListener("DOMContentLoaded", () => {
  inicializarNavegacao();
  verificarStatusApi();
  renderizarDashboard();
  renderizarTabelaEstoque(produtos);
  renderizarHistorico();
  renderizarAlertas();
  inicializarBuscaEstoque();
  inicializarMovimentacao();
});

function inicializarNavegacao() {
  const botoesMenu = document.querySelectorAll(".menu-button");
  const secoes = document.querySelectorAll(".page-section");

  botoesMenu.forEach((botao) => {
    botao.addEventListener("click", () => {
      const pagina = botao.dataset.page;

      botoesMenu.forEach((item) => item.classList.remove("active"));
      botao.classList.add("active");

      secoes.forEach((secao) => {
        secao.classList.remove("active");
      });

      const secaoAtiva = document.getElementById(`page-${pagina}`);

      if (secaoAtiva) {
        secaoAtiva.classList.add("active");
      }
    });
  });
}

function verificarStatusApi() {
  const apiStatus = document.getElementById("apiStatus");

  if (!apiStatus) return;

  apiStatus.textContent = "API: Online";
  apiStatus.classList.add("status-online");
}

function obterStatusProduto(produto) {
  if (produto.quantidade === 0) {
    return {
      texto: "Esgotado",
      classe: "status-out",
    };
  }

  if (produto.quantidade < produto.estoqueMinimo) {
    return {
      texto: "Crítico",
      classe: "status-critical",
    };
  }

  if (produto.quantidade === produto.estoqueMinimo) {
    return {
      texto: "Atenção",
      classe: "status-warning",
    };
  }

  return {
    texto: "Disponível",
    classe: "status-ok",
  };
}

function renderizarDashboard() {
  const totalProdutos = document.getElementById("totalProdutos");
  const totalCriticos = document.getElementById("totalCriticos");
  const totalEsgotados = document.getElementById("totalEsgotados");
  const totalMovimentacoesHoje = document.getElementById(
    "totalMovimentacoesHoje",
  );
  const dashboardMovimentacoes = document.getElementById(
    "dashboardMovimentacoes",
  );

  const criticos = produtos.filter(
    (produto) =>
      produto.quantidade > 0 && produto.quantidade < produto.estoqueMinimo,
  );

  const esgotados = produtos.filter((produto) => produto.quantidade === 0);

  if (totalProdutos) totalProdutos.textContent = produtos.length;
  if (totalCriticos) totalCriticos.textContent = criticos.length;
  if (totalEsgotados) totalEsgotados.textContent = esgotados.length;
  if (totalMovimentacoesHoje) {
    totalMovimentacoesHoje.textContent = movimentacoes.length;
  }

  if (!dashboardMovimentacoes) return;

  const ultimasMovimentacoes = movimentacoes.slice(0, 5);

  if (ultimasMovimentacoes.length === 0) {
    dashboardMovimentacoes.innerHTML = `
      <tr>
        <td colspan="4" class="empty-row">Nenhuma movimentação carregada.</td>
      </tr>
    `;
    return;
  }

  dashboardMovimentacoes.innerHTML = ultimasMovimentacoes
    .map(
      (movimentacao) => `
        <tr>
          <td>${movimentacao.produto}</td>
          <td><span class="badge ${movimentacao.tipo.toLowerCase()}">${formatarTipoMovimentacao(movimentacao.tipo)}</span></td>
          <td>${movimentacao.quantidade}</td>
          <td>${movimentacao.data}</td>
        </tr>
      `,
    )
    .join("");
}

function renderizarTabelaEstoque(listaProdutos) {
  const estoqueTabela = document.getElementById("estoqueTabela");

  if (!estoqueTabela) return;

  if (listaProdutos.length === 0) {
    estoqueTabela.innerHTML = `
      <tr>
        <td colspan="6" class="empty-row">Nenhum produto encontrado.</td>
      </tr>
    `;
    return;
  }

  estoqueTabela.innerHTML = listaProdutos
    .map((produto) => {
      const status = obterStatusProduto(produto);

      return `
        <tr>
          <td>${produto.nome}</td>
          <td>${produto.sku}</td>
          <td>${produto.variacao}</td>
          <td>${produto.quantidade}</td>
          <td>${produto.estoqueMinimo}</td>
          <td><span class="stock-status ${status.classe}">${status.texto}</span></td>
        </tr>
      `;
    })
    .join("");
}

function inicializarBuscaEstoque() {
  const inputBusca = document.getElementById("estoqueBusca");
  const btnBuscar = document.getElementById("btnBuscarEstoque");

  if (!inputBusca || !btnBuscar) return;

  btnBuscar.addEventListener("click", () => {
    buscarProdutosEstoque(inputBusca.value);
  });

  inputBusca.addEventListener("input", () => {
    buscarProdutosEstoque(inputBusca.value);
  });
}

function buscarProdutosEstoque(termo) {
  const termoNormalizado = normalizarTexto(termo);

  const resultado = produtos.filter((produto) => {
    return (
      normalizarTexto(produto.nome).includes(termoNormalizado) ||
      normalizarTexto(produto.sku).includes(termoNormalizado) ||
      normalizarTexto(produto.variacao).includes(termoNormalizado)
    );
  });

  renderizarTabelaEstoque(resultado);
}

function inicializarMovimentacao() {
  const btnBuscarProdutoMov = document.getElementById("btnBuscarProdutoMov");
  const movBuscaProduto = document.getElementById("movBuscaProduto");
  const tipoMovimentacao = document.getElementById("tipoMovimentacao");
  const quantidadeMovimentacao = document.getElementById(
    "quantidadeMovimentacao",
  );
  const motivoMovimentacao = document.getElementById("motivoMovimentacao");
  const btnLimpar = document.getElementById("btnLimparMovimentacao");
  const btnConfirmar = document.getElementById("btnConfirmarMovimentacao");

  if (btnBuscarProdutoMov && movBuscaProduto) {
    btnBuscarProdutoMov.addEventListener("click", () => {
      selecionarProdutoParaMovimentacao(movBuscaProduto.value);
    });

    movBuscaProduto.addEventListener("keydown", (evento) => {
      if (evento.key === "Enter") {
        selecionarProdutoParaMovimentacao(movBuscaProduto.value);
      }
    });
  }

  [tipoMovimentacao, quantidadeMovimentacao, motivoMovimentacao].forEach(
    (campo) => {
      if (campo) {
        campo.addEventListener("input", atualizarResumoMovimentacao);
        campo.addEventListener("change", atualizarResumoMovimentacao);
      }
    },
  );

  if (btnLimpar) {
    btnLimpar.addEventListener("click", limparMovimentacao);
  }

  if (btnConfirmar) {
    btnConfirmar.addEventListener("click", confirmarMovimentacao);
  }
}

function selecionarProdutoParaMovimentacao(termo) {
  const produtoSelecionadoBox = document.getElementById("produtoSelecionado");
  const termoNormalizado = normalizarTexto(termo);

  if (!termoNormalizado) {
    produtoSelecionado = null;

    if (produtoSelecionadoBox) {
      produtoSelecionadoBox.innerHTML = `
        <span>Informe nome, código ou SKU para buscar um produto.</span>
      `;
    }

    atualizarResumoMovimentacao();
    return;
  }

  const produtoEncontrado = produtos.find((produto) => {
    return (
      normalizarTexto(produto.nome).includes(termoNormalizado) ||
      normalizarTexto(produto.sku).includes(termoNormalizado) ||
      normalizarTexto(produto.variacao).includes(termoNormalizado)
    );
  });

  if (!produtoEncontrado) {
    produtoSelecionado = null;

    if (produtoSelecionadoBox) {
      produtoSelecionadoBox.innerHTML = `
        <span>Produto não encontrado.</span>
      `;
    }

    atualizarResumoMovimentacao();
    return;
  }

  produtoSelecionado = produtoEncontrado;

  const status = obterStatusProduto(produtoSelecionado);

  if (produtoSelecionadoBox) {
    produtoSelecionadoBox.innerHTML = `
      <strong>${produtoSelecionado.nome}</strong>
      <span>${produtoSelecionado.sku} • ${produtoSelecionado.variacao}</span>
      <span>Estoque atual: ${produtoSelecionado.quantidade} | Mínimo: ${produtoSelecionado.estoqueMinimo}</span>
      <span class="stock-status ${status.classe}">${status.texto}</span>
    `;
  }

  atualizarResumoMovimentacao();
}

function atualizarResumoMovimentacao() {
  const resumoProduto = document.getElementById("resumoProduto");
  const resumoTipo = document.getElementById("resumoTipo");
  const resumoQuantidade = document.getElementById("resumoQuantidade");
  const resumoMotivo = document.getElementById("resumoMotivo");
  const resumoNovoEstoque = document.getElementById("resumoNovoEstoque");

  const tipo = document.getElementById("tipoMovimentacao")?.value || "";
  const quantidade = Number(
    document.getElementById("quantidadeMovimentacao")?.value || 0,
  );
  const motivo = document.getElementById("motivoMovimentacao")?.value || "";

  if (resumoProduto) {
    resumoProduto.textContent = produtoSelecionado
      ? `${produtoSelecionado.nome} - ${produtoSelecionado.variacao}`
      : "—";
  }

  if (resumoTipo) {
    resumoTipo.textContent = tipo ? formatarTipoMovimentacao(tipo) : "—";
  }

  if (resumoQuantidade) {
    resumoQuantidade.textContent = quantidade;
  }

  if (resumoMotivo) {
    resumoMotivo.textContent = motivo ? formatarMotivo(motivo) : "—";
  }

  if (resumoNovoEstoque) {
    resumoNovoEstoque.textContent = calcularNovoEstoque(tipo, quantidade);
  }
}

function calcularNovoEstoque(tipo, quantidade) {
  if (!produtoSelecionado || !tipo || quantidade <= 0) {
    return "—";
  }

  if (tipo === "ENTRADA") {
    return produtoSelecionado.quantidade + quantidade;
  }

  if (tipo === "SAIDA") {
    return produtoSelecionado.quantidade - quantidade;
  }

  if (tipo === "AJUSTE") {
    return quantidade;
  }

  return "—";
}

function confirmarMovimentacao() {
  const tipo = document.getElementById("tipoMovimentacao")?.value || "";
  const quantidade = Number(
    document.getElementById("quantidadeMovimentacao")?.value || 0,
  );
  const motivo = document.getElementById("motivoMovimentacao")?.value || "";

  if (!produtoSelecionado) {
    alert("Selecione um produto antes de confirmar a movimentação.");
    return;
  }

  if (!tipo) {
    alert("Selecione o tipo de movimentação.");
    return;
  }

  if (!quantidade || quantidade <= 0) {
    alert("Informe uma quantidade maior que zero.");
    return;
  }

  if (!motivo) {
    alert("Selecione o motivo da movimentação.");
    return;
  }

  if (tipo === "SAIDA" && quantidade > produtoSelecionado.quantidade) {
    alert("Saída não permitida: quantidade maior que o estoque disponível.");
    return;
  }

  if (tipo === "ENTRADA") {
    produtoSelecionado.quantidade += quantidade;
  }

  if (tipo === "SAIDA") {
    produtoSelecionado.quantidade -= quantidade;
  }

  if (tipo === "AJUSTE") {
    produtoSelecionado.quantidade = quantidade;
  }

  movimentacoes.unshift({
    produto: produtoSelecionado.nome,
    sku: produtoSelecionado.sku,
    tipo,
    quantidade,
    motivo: formatarMotivo(motivo),
    data: obterDataAtualFormatada(),
  });

  renderizarDashboard();
  renderizarTabelaEstoque(produtos);
  renderizarHistorico();
  renderizarAlertas();
  atualizarResumoMovimentacao();

  alert("Movimentação registrada com sucesso.");
}

function limparMovimentacao() {
  produtoSelecionado = null;

  const campos = [
    "movBuscaProduto",
    "tipoMovimentacao",
    "quantidadeMovimentacao",
    "motivoMovimentacao",
  ];

  campos.forEach((id) => {
    const campo = document.getElementById(id);

    if (campo) {
      campo.value = id === "quantidadeMovimentacao" ? "0" : "";
    }
  });

  const produtoSelecionadoBox = document.getElementById("produtoSelecionado");

  if (produtoSelecionadoBox) {
    produtoSelecionadoBox.innerHTML = `
      <span>Nenhum produto selecionado.</span>
    `;
  }

  atualizarResumoMovimentacao();
}

function renderizarHistorico() {
  const historicoTabela = document.getElementById("historicoTabela");
  const btnAtualizarHistorico = document.getElementById(
    "btnAtualizarHistorico",
  );

  if (btnAtualizarHistorico) {
    btnAtualizarHistorico.onclick = renderizarHistorico;
  }

  if (!historicoTabela) return;

  if (movimentacoes.length === 0) {
    historicoTabela.innerHTML = `
      <tr>
        <td colspan="6" class="empty-row">Nenhum registro carregado.</td>
      </tr>
    `;
    return;
  }

  historicoTabela.innerHTML = movimentacoes
    .map(
      (movimentacao) => `
        <tr>
          <td>${movimentacao.produto}</td>
          <td>${movimentacao.sku}</td>
          <td><span class="badge ${movimentacao.tipo.toLowerCase()}">${formatarTipoMovimentacao(movimentacao.tipo)}</span></td>
          <td>${movimentacao.quantidade}</td>
          <td>${movimentacao.motivo}</td>
          <td>${movimentacao.data}</td>
        </tr>
      `,
    )
    .join("");
}

function renderizarAlertas() {
  const alertasLista = document.getElementById("alertasLista");
  const alertasStatus = document.getElementById("alertasStatus");

  if (!alertasLista) return;

  const produtosComAlerta = produtos.filter(
    (produto) =>
      produto.quantidade === 0 || produto.quantidade <= produto.estoqueMinimo,
  );

  if (alertasStatus) {
    alertasStatus.textContent =
      produtosComAlerta.length > 0
        ? `${produtosComAlerta.length} alerta(s) encontrado(s)`
        : "Nenhum alerta encontrado";
  }

  if (produtosComAlerta.length === 0) {
    alertasLista.innerHTML = `
      <div class="empty-state">Nenhum produto em situação crítica.</div>
    `;
    return;
  }

  alertasLista.innerHTML = produtosComAlerta
    .map((produto) => {
      const status = obterStatusProduto(produto);

      return `
        <article class="alert-card">
          <strong>${produto.nome}</strong>
          <span>${produto.sku} • ${produto.variacao}</span>
          <p>Estoque atual: ${produto.quantidade} | Estoque mínimo: ${produto.estoqueMinimo}</p>
          <span class="stock-status ${status.classe}">${status.texto}</span>
        </article>
      `;
    })
    .join("");
}

function formatarTipoMovimentacao(tipo) {
  const tipos = {
    ENTRADA: "Entrada",
    SAIDA: "Saída",
    AJUSTE: "Ajuste",
  };

  return tipos[tipo] || tipo;
}

function formatarMotivo(motivo) {
  const motivos = {
    REPOSICAO: "Reposição de estoque",
    COMPRA: "Compra",
    VENDA: "Venda",
    DEVOLUCAO: "Devolução",
    PERDA: "Perda",
    CORRECAO: "Correção de saldo",
  };
  return motivos[motivo] || motivo;
}

function normalizarTexto(texto) {
  return String(texto)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function obterDataAtualFormatada() {
  const data = new Date();

  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  const hora = String(data.getHours()).padStart(2, "0");
  const minuto = String(data.getMinutes()).padStart(2, "0");

  return `${ano}-${mes}-${dia} ${hora}:${minuto}`;
}
