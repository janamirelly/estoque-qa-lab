const produtos = [
  {
    id: 1,
    idVariacao: 1,
    nome: "Camiseta Básica",
    sku: "CAM-AMARELO-M",
    variacao: "Amarelo / M",
    quantidade: 18,
    estoqueMinimo: 10,
  },
  {
    id: 2,
    idVariacao: 2,
    nome: "Camiseta Básica",
    sku: "CAM-BRANCO-M",
    variacao: "Branco / M",
    quantidade: 7,
    estoqueMinimo: 10,
  },
  {
    id: 3,
    idVariacao: 3,
    nome: "Calça Jeans",
    sku: "CAJ-AZUL-M",
    variacao: "Azul / M",
    quantidade: 0,
    estoqueMinimo: 10,
  },
  {
    id: 4,
    idVariacao: 4,
    nome: "Vestido Midi",
    sku: "VES-PRETO-P",
    variacao: "Preto / P",
    quantidade: 12,
    estoqueMinimo: 10,
  },
];

const motivosPorTipo = {
  ENTRADA: [
    { value: "REPOSICAO", label: "Reposição de estoque" },
    { value: "COMPRA", label: "Compra" },
    { value: "DEVOLUCAO", label: "Devolução" },
  ],
  SAIDA: [
    { value: "VENDA", label: "Venda" },
    { value: "PERDA", label: "Perda" },
    { value: "RETIRADA_OPERACIONAL", label: "Retirada operacional" },
  ],
  AJUSTE: [
    { value: "CORRECAO", label: "Correção de saldo" },
    { value: "INVENTARIO", label: "Inventário" },
  ],
};

let movimentacoes = [
  {
    produto: "Camiseta Básica",
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
  inicializarBuscaEstoque();
  inicializarMovimentacao();

  renderizarTudo();
});

function renderizarTudo() {
  renderizarDashboard();
  renderizarTabelaEstoque(produtos);
  renderizarHistorico();
  renderizarAlertas();
}

/* =========================
   Navegação
========================= */

function inicializarNavegacao() {
  const botoesMenu = document.querySelectorAll(".menu-button");
  const secoes = document.querySelectorAll(".page-section");

  botoesMenu.forEach((botao) => {
    botao.addEventListener("click", () => {
      const pagina = botao.dataset.page;

      botoesMenu.forEach((item) => item.classList.remove("active"));
      botao.classList.add("active");

      secoes.forEach((secao) => secao.classList.remove("active"));

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

  apiStatus.textContent = "API: mock local";
  apiStatus.classList.add("status-online");
}

/* =========================
   Renderizações
========================= */

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
          <td>
            <span class="badge ${movimentacao.tipo.toLowerCase()}">
              ${formatarTipoMovimentacao(movimentacao.tipo)}
            </span>
          </td>
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
          <td>
            <span class="stock-status ${status.classe}">
              ${status.texto}
            </span>
          </td>
        </tr>
      `;
    })
    .join("");
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
          <td>
            <span class="badge ${movimentacao.tipo.toLowerCase()}">
              ${formatarTipoMovimentacao(movimentacao.tipo)}
            </span>
          </td>
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
          <p>
            Estoque atual: ${produto.quantidade} |
            Estoque mínimo: ${produto.estoqueMinimo}
          </p>
          <span class="stock-status ${status.classe}">
            ${status.texto}
          </span>
        </article>
      `;
    })
    .join("");
}

/* =========================
   Consulta de estoque
========================= */

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

/* =========================
   Movimentação
========================= */

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

  atualizarMotivosPorTipo("");

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

  if (tipoMovimentacao) {
    tipoMovimentacao.addEventListener("change", () => {
      atualizarMotivosPorTipo(tipoMovimentacao.value);
      atualizarResumoMovimentacao();
      limparFeedback();
    });
  }

  [quantidadeMovimentacao, motivoMovimentacao].forEach((campo) => {
    if (!campo) return;

    campo.addEventListener("input", () => {
      atualizarResumoMovimentacao();
      limparFeedback();
    });

    campo.addEventListener("change", () => {
      atualizarResumoMovimentacao();
      limparFeedback();
    });
  });

  if (btnLimpar) {
    btnLimpar.addEventListener("click", limparMovimentacao);
  }

  if (btnConfirmar) {
    btnConfirmar.addEventListener("click", confirmarMovimentacao);
  }
}

function atualizarMotivosPorTipo(tipo) {
  const motivoMovimentacao = document.getElementById("motivoMovimentacao");

  if (!motivoMovimentacao) return;

  if (!tipo) {
    motivoMovimentacao.innerHTML = `
      <option value="">Selecione o tipo primeiro...</option>
    `;
    motivoMovimentacao.disabled = true;
    return;
  }

  const motivos = motivosPorTipo[tipo] || [];

  motivoMovimentacao.disabled = false;

  motivoMovimentacao.innerHTML = `
    <option value="">Selecione...</option>
    ${motivos
      .map(
        (motivo) => `
          <option value="${motivo.value}">${motivo.label}</option>
        `,
      )
      .join("")}
  `;
}

function selecionarProdutoParaMovimentacao(termo) {
  const produtoSelecionadoBox = document.getElementById("produtoSelecionado");
  const termoNormalizado = normalizarTexto(termo);

  limparFeedback();

  if (!termoNormalizado) {
    produtoSelecionado = null;
    renderizarProdutoSelecionado();
    atualizarResumoMovimentacao();

    exibirFeedback(
      "Informe nome, código ou SKU para buscar um produto.",
      "warning",
    );
    return;
  }

  const produtoEncontrado = encontrarProduto(termoNormalizado);

  if (!produtoEncontrado) {
    produtoSelecionado = null;
    renderizarProdutoSelecionado();
    atualizarResumoMovimentacao();

    exibirFeedback("Produto não encontrado.", "warning");
    return;
  }

  produtoSelecionado = produtoEncontrado;

  if (produtoSelecionadoBox) {
    renderizarProdutoSelecionado();
  }

  atualizarResumoMovimentacao();
}

function encontrarProduto(termoNormalizado) {
  return (
    produtos.find(
      (produto) => normalizarTexto(produto.sku) === termoNormalizado,
    ) ||
    produtos.find((produto) =>
      normalizarTexto(produto.sku).includes(termoNormalizado),
    ) ||
    produtos.find((produto) =>
      normalizarTexto(produto.nome).includes(termoNormalizado),
    ) ||
    produtos.find((produto) =>
      normalizarTexto(produto.variacao).includes(termoNormalizado),
    )
  );
}

function renderizarProdutoSelecionado() {
  const produtoSelecionadoBox = document.getElementById("produtoSelecionado");

  if (!produtoSelecionadoBox) return;

  if (!produtoSelecionado) {
    produtoSelecionadoBox.innerHTML = `
      <span>Nenhum produto selecionado.</span>
    `;
    return;
  }

  const status = obterStatusProduto(produtoSelecionado);

  produtoSelecionadoBox.innerHTML = `
    <strong>${produtoSelecionado.nome}</strong>
    <span>${produtoSelecionado.sku} • ${produtoSelecionado.variacao}</span>
    <span>
      Estoque atual: ${produtoSelecionado.quantidade} |
      Mínimo: ${produtoSelecionado.estoqueMinimo}
    </span>
    <span class="stock-status ${status.classe}">
      ${status.texto}
    </span>
  `;
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
    resumoNovoEstoque.textContent = calcularNovoEstoquePrevisto(
      tipo,
      quantidade,
    );
  }
}

function calcularNovoEstoquePrevisto(tipo, quantidade) {
  if (!produtoSelecionado || !tipo || quantidade <= 0) {
    return "—";
  }

  const estoqueAtual = Number(produtoSelecionado.quantidade);

  if (tipo === "ENTRADA") {
    return estoqueAtual + quantidade;
  }

  if (tipo === "SAIDA") {
    return estoqueAtual - quantidade;
  }

  if (tipo === "AJUSTE") {
    return quantidade;
  }

  return "—";
}

async function confirmarMovimentacao() {
  const btnConfirmar = document.getElementById("btnConfirmarMovimentacao");

  limparFeedback();

  const validacao = validarFormularioMovimentacao();

  if (!validacao.valido) {
    exibirFeedback(validacao.mensagem, "warning");
    return;
  }

  const payload = montarPayloadMovimentacao();

  setBotaoConfirmarCarregando(true);

  try {
    const resposta = await registrarMovimentacaoMock(payload);

    atualizarProdutoAposResposta(resposta);
    registrarMovimentacaoNoHistorico(resposta);

    renderizarTudo();
    renderizarProdutoSelecionado();
    atualizarResumoComEstoqueAtual(resposta.estoque.atual);

    exibirFeedback(resposta.message, "success");
  } catch (erro) {
    exibirFeedback(
      erro.message || "Não foi possível registrar a movimentação.",
      "error",
    );
  } finally {
    setBotaoConfirmarCarregando(false);

    if (btnConfirmar) {
      btnConfirmar.focus();
    }
  }
}

function validarFormularioMovimentacao() {
  const tipo = document.getElementById("tipoMovimentacao")?.value || "";
  const quantidade = Number(
    document.getElementById("quantidadeMovimentacao")?.value || 0,
  );
  const motivo = document.getElementById("motivoMovimentacao")?.value || "";

  if (!produtoSelecionado) {
    return {
      valido: false,
      mensagem: "Selecione um produto antes de confirmar a movimentação.",
    };
  }

  if (!tipo) {
    return {
      valido: false,
      mensagem: "Selecione o tipo de movimentação.",
    };
  }

  if (!quantidade || quantidade <= 0) {
    return {
      valido: false,
      mensagem: "Informe uma quantidade maior que zero.",
    };
  }

  if (!motivo) {
    return {
      valido: false,
      mensagem: "Selecione o motivo da movimentação.",
    };
  }

  return {
    valido: true,
  };
}

function montarPayloadMovimentacao() {
  return {
    id_variacao: produtoSelecionado.idVariacao,
    tipo: document.getElementById("tipoMovimentacao")?.value || "",
    quantidade: Number(
      document.getElementById("quantidadeMovimentacao")?.value || 0,
    ),
    motivo: document.getElementById("motivoMovimentacao")?.value || "",
  };
}

/*
  Simulação temporária da API.
  Depois será substituída por fetch("/estoque/movimentacoes").
*/
function registrarMovimentacaoMock(payload) {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      const produto = produtos.find(
        (item) => item.idVariacao === payload.id_variacao,
      );

      if (!produto) {
        reject(new Error("Produto ou variação não encontrado."));
        return;
      }

      const estoqueAnterior = Number(produto.quantidade);
      let estoqueAtual = estoqueAnterior;

      if (payload.tipo === "ENTRADA") {
        estoqueAtual = estoqueAnterior + payload.quantidade;
      }

      if (payload.tipo === "SAIDA") {
        if (payload.quantidade > estoqueAnterior) {
          reject(
            new Error(
              "Saída não permitida: quantidade maior que o estoque disponível.",
            ),
          );
          return;
        }

        estoqueAtual = estoqueAnterior - payload.quantidade;
      }

      if (payload.tipo === "AJUSTE") {
        estoqueAtual = payload.quantidade;
      }

      resolve({
        message: "Movimentação registrada com sucesso.",
        movimentacao: {
          tipo: payload.tipo,
          quantidade: payload.quantidade,
          motivo: payload.motivo,
          data: obterDataAtualFormatada(),
        },
        estoque: {
          anterior: estoqueAnterior,
          atual: estoqueAtual,
        },
        produto: {
          id_variacao: produto.idVariacao,
          nome: produto.nome,
          sku: produto.sku,
          variacao: produto.variacao,
        },
      });
    }, 300);
  });
}

function atualizarProdutoAposResposta(resposta) {
  const produto = produtos.find(
    (item) => item.idVariacao === resposta.produto.id_variacao,
  );

  if (!produto) return;

  produto.quantidade = resposta.estoque.atual;

  if (
    produtoSelecionado &&
    produtoSelecionado.idVariacao === produto.idVariacao
  ) {
    produtoSelecionado = produto;
  }
}

function registrarMovimentacaoNoHistorico(resposta) {
  movimentacoes.unshift({
    produto: resposta.produto.nome,
    sku: resposta.produto.sku,
    tipo: resposta.movimentacao.tipo,
    quantidade: resposta.movimentacao.quantidade,
    motivo: formatarMotivo(resposta.movimentacao.motivo),
    data: resposta.movimentacao.data,
  });
}

function atualizarResumoComEstoqueAtual(estoqueAtual) {
  const resumoNovoEstoque = document.getElementById("resumoNovoEstoque");

  if (!resumoNovoEstoque) return;

  resumoNovoEstoque.textContent = estoqueAtual;
}

function setBotaoConfirmarCarregando(carregando) {
  const btnConfirmar = document.getElementById("btnConfirmarMovimentacao");

  if (!btnConfirmar) return;

  btnConfirmar.disabled = carregando;
  btnConfirmar.textContent = carregando
    ? "Registrando..."
    : "Confirmar movimentação";
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

  atualizarMotivosPorTipo("");
  renderizarProdutoSelecionado();
  atualizarResumoMovimentacao();
  limparFeedback();
}

/* =========================
   Feedback
========================= */

function exibirFeedback(mensagem, tipo = "success") {
  const feedbackMessage = document.getElementById("feedbackMessage");
  const feedbackText = document.getElementById("feedbackText");

  if (!feedbackMessage || !feedbackText) return;

  feedbackMessage.className = `feedback-message show ${tipo}`;
  feedbackText.textContent = mensagem;

  window.clearTimeout(exibirFeedback.timeoutId);

  exibirFeedback.timeoutId = window.setTimeout(() => {
    limparFeedback();
  }, 5000);
}

function limparFeedback() {
  const feedbackMessage = document.getElementById("feedbackMessage");
  const feedbackText = document.getElementById("feedbackText");

  if (!feedbackMessage || !feedbackText) return;

  feedbackMessage.className = "feedback-message";
  feedbackText.textContent = "";

  window.clearTimeout(exibirFeedback.timeoutId);
}

/* =========================
   Formatadores
========================= */

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
    DEVOLUCAO: "Devolução",
    VENDA: "Venda",
    PERDA: "Perda",
    RETIRADA_OPERACIONAL: "Retirada operacional",
    CORRECAO: "Correção de saldo",
    INVENTARIO: "Inventário",
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
