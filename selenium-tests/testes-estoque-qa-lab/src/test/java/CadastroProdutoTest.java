import database.ProdutoDAO;
import io.github.bonigarcia.wdm.WebDriverManager;
import massas.MassaCadastroProduto;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.Alert;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import variaveis.CadastroProduto;
import variaveis.ElementosEstoque;
import variaveis.VariaveisEstoque;

import java.time.Duration;

import static org.junit.Assert.*;

public class CadastroProdutoTest {
    private WebDriver driver;

    private static final String MSG_PRODUTO_CADASTRADO =
            "Produto cadastrado com sucesso";

    private static final String MSG_ALTERACAO_SALVA =
            "Alteração salva com sucesso";

    private static final String MSG_PRODUTO_EXCLUIDO =
            "Produto excluído com sucesso";

    @Before
    public void iniciarTeste() {
        WebDriverManager.chromedriver().setup();

        driver = new ChromeDriver();
        driver.manage().window().maximize();

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        driver.get(VariaveisEstoque.URL_ESTOQUE);

        wait.until(ExpectedConditions.elementToBeClickable(
                ElementosEstoque.BOTAO_CADASTRO
        )).click();

        wait.until(ExpectedConditions.visibilityOfElementLocated(
                ElementosEstoque.PG_CADASTRO_PRODUTO_ATIVA
        ));

        assertTrue(
                driver.findElement(ElementosEstoque.PG_CADASTRO_PRODUTO_ATIVA)
                        .isDisplayed()
        );
    }

    //@After
   // public void finalizarTeste() {
    //    driver.quit();
    //}

    @Test
    public void CT03_cadastrarProdutoValido() {
        // Dado: que o usuário esteja na tela de cadastro
        String nomeProduto = MassaCadastroProduto.nomeProdutoValido();
        String cor = MassaCadastroProduto.corValida();
        String tamanho = MassaCadastroProduto.tamanhoValido();
        String sku = MassaCadastroProduto.skuValido();
        String preco = MassaCadastroProduto.precoValido();
        String quantidadeInicial =
                MassaCadastroProduto.quantidadeInicialValida();
        String estoqueMinimo =
                MassaCadastroProduto.estoqueMinimoValido();

        // Quando: preencher os dados válidos do produto
        preencherFormularioProduto(
                nomeProduto,
                cor,
                tamanho,
                sku,
                preco,
                quantidadeInicial,
                estoqueMinimo
        );

        //E: Clicar no botão cadastrar produto
        clicarBotaoCadastrarProduto();

        // Então: o sistema deve exibir mensagem de sucesso
        validarMensagemFeedback(MSG_PRODUTO_CADASTRADO);

        // E: o produto deve ser persistido no banco de dados
        assertTrue(
                "O produto cadastrado não foi encontrado no banco de dados.",
                ProdutoDAO.existeProdutoPorSku(sku)
        );
    }

    @Test
    public void CT04_editarProdutoValido() {
        // Dado: que exista um produto cadastrado
        String sku = cadastrarProdutoParaTeste();

        String novoPreco = MassaCadastroProduto.novoPrecoValidoEdicao();

        // Quando: buscar o produto cadastrado na tela de estoque
        acessarTelaConsultarEstoque();
        buscarProdutoPorSku(sku);

        // E: clicar em Editar
        clicarBotaoEditarProduto();

        aguardarTelaCadastroProduto();

        // E: alterar o preço do produto
        alterarPrecoProduto(novoPreco);

        // E: clicar em Salvar alterações
        clicarBotaoSalvarAlteracoes();

        // Então: o sistema deve exibir mensagem de sucesso
        validarMensagemFeedback(MSG_ALTERACAO_SALVA);

        // E: o novo preço deve ser persistido no banco
        assertTrue(
                "O preço editado não foi encontrado no banco de dados.",
                ProdutoDAO.existeProdutoComPreco(sku, novoPreco)
        );
    }

    @Test
    public void CT05_excluirProdutoValido() {
        // Dado: que exista um produto cadastrado para exclusão
        String sku = cadastrarProdutoParaTeste();

        // Quando: buscar o produto cadastrado na tela de estoque
        acessarTelaConsultarEstoque();
        buscarProdutoPorSku(sku);
        validarProdutoExibidoNaTabela(sku);

        // E: clicar em Excluir
        clicarBotaoExcluirProduto();

        // E: confirmar a exclusão no alerta do navegador
        confirmarExclusaoProduto();

        // Então: o sistema deve exibir mensagem de sucesso da exclusão
        validarMensagemFeedback(MSG_PRODUTO_EXCLUIDO);

        // E: o produto não deve mais ser encontrado no banco de dados
        assertFalse(
                "O produto excluído continua ativo no banco de dados.",
                ProdutoDAO.produtoEstaAtivoPorSku(sku)
        );
    }

    private String cadastrarProdutoParaTeste() {
        String nomeProduto = MassaCadastroProduto.nomeProdutoValido();
        String cor = MassaCadastroProduto.corValida();
        String tamanho = MassaCadastroProduto.tamanhoValido();
        String sku = MassaCadastroProduto.skuValido();
        String preco = MassaCadastroProduto.precoValido();
        String quantidadeInicial =
                MassaCadastroProduto.quantidadeInicialValida();
        String estoqueMinimo =
                MassaCadastroProduto.estoqueMinimoValido();

        preencherFormularioProduto(
                nomeProduto,
                cor,
                tamanho,
                sku,
                preco,
                quantidadeInicial,
                estoqueMinimo
        );

        clicarBotaoCadastrarProduto();

        validarMensagemFeedback(MSG_PRODUTO_CADASTRADO);

        assertTrue(
                "Produto não foi cadastrado para preparação do teste.",
                ProdutoDAO.existeProdutoPorSku(sku)
        );

        return sku;
    }

    private void preencherFormularioProduto(
            String nomeProduto,
            String cor,
            String tamanho,
            String sku,
            String preco,
            String quantidadeInicial,
            String estoqueMinimo
    ) {
        driver.findElement(CadastroProduto.INPUT_NOME)
                .sendKeys(nomeProduto);

        driver.findElement(CadastroProduto.INPUT_COR)
                .sendKeys(cor);

        driver.findElement(CadastroProduto.INPUT_TAMANHO)
                .sendKeys(tamanho);

        driver.findElement(CadastroProduto.INPUT_SKU)
                .sendKeys(sku);

        driver.findElement(CadastroProduto.INPUT_PRECO)
                .sendKeys(preco);

        driver.findElement(CadastroProduto.INPUT_QTD).clear();
        driver.findElement(CadastroProduto.INPUT_QTD)
                .sendKeys(quantidadeInicial);

        driver.findElement(CadastroProduto.INPUT_ESTOQUE_MIN).clear();
        driver.findElement(CadastroProduto.INPUT_ESTOQUE_MIN)
                .sendKeys(estoqueMinimo);
    }

    private void clicarBotaoCadastrarProduto() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        WebElement botaoCadastrar = wait.until(
                ExpectedConditions.elementToBeClickable(
                        ElementosEstoque.BOTAO_CADASTRAR
                )
        );

        new Actions(driver)
                .scrollToElement(botaoCadastrar)
                .perform();

        botaoCadastrar.click();
    }

    private void acessarTelaConsultarEstoque() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        wait.until(ExpectedConditions.elementToBeClickable(
                ElementosEstoque.BOTAO_CONSULTAR_ESTOQUE
        )).click();

        wait.until(ExpectedConditions.visibilityOfElementLocated(
                ElementosEstoque.PG_CONSULTAR_ESTOQUE_ATIVA
        ));
    }

    private void buscarProdutoPorSku(String sku) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        WebElement campoBusca = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        ElementosEstoque.INPUT_BUSCA_ESTOQUE
                )
        );

        campoBusca.clear();
        campoBusca.sendKeys(sku);

        wait.until(ExpectedConditions.elementToBeClickable(
                ElementosEstoque.BOTAO_BUSCAR_ESTOQUE
        )).click();
    }

    private void validarProdutoExibidoNaTabela(String sku) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        WebElement tabela = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        ElementosEstoque.TABELA_ESTOQUE
                )
        );

        assertTrue(
                "O produto buscado não apareceu na tabela.",
                tabela.getText().contains(sku)
        );
    }

    private void clicarBotaoEditarProduto() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        WebElement botaoEditar = wait.until(
                ExpectedConditions.elementToBeClickable(
                        ElementosEstoque.BOTAO_EDITAR_PRODUTO
                )
        );

        new Actions(driver)
                .scrollToElement(botaoEditar)
                .perform();

        botaoEditar.click();
    }

    private void clicarBotaoExcluirProduto() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        WebElement botaoExcluir = wait.until(
                ExpectedConditions.elementToBeClickable(
                        ElementosEstoque.BOTAO_EXCLUIR_PRODUTO
                )
        );

        new Actions(driver)
                .scrollToElement(botaoExcluir)
                .perform();

        botaoExcluir.click();
    }

    private void confirmarExclusaoProduto() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        Alert alerta = wait.until(ExpectedConditions.alertIsPresent());

        alerta.accept();
    }

    private void aguardarTelaCadastroProduto() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        wait.until(ExpectedConditions.visibilityOfElementLocated(
                ElementosEstoque.PG_CADASTRO_PRODUTO_ATIVA
        ));
    }

    private void alterarPrecoProduto(String novoPreco) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        WebElement campoPreco = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        CadastroProduto.INPUT_PRECO
                )
        );

        campoPreco.clear();
        campoPreco.sendKeys(novoPreco);
    }

    private void clicarBotaoSalvarAlteracoes() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        WebElement botaoSalvarAlteracoes = wait.until(
                ExpectedConditions.elementToBeClickable(
                        ElementosEstoque.BOTAO_SALVAR_ALTERACOES
                )
        );

        new Actions(driver)
                .scrollToElement(botaoSalvarAlteracoes)
                .perform();

        botaoSalvarAlteracoes.click();
    }

    private void validarMensagemFeedback(String mensagemEsperada) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        wait.until(
                ExpectedConditions.textToBePresentInElementLocated(
                        ElementosEstoque.TEXTO_FEEDBACK,
                        mensagemEsperada
                )
        );

        WebElement mensagemSucesso =
                driver.findElement(ElementosEstoque.TEXTO_FEEDBACK);

        assertTrue(
                mensagemSucesso.getText().contains(mensagemEsperada)
        );
    }
}


