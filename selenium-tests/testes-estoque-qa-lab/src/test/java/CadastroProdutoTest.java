import database.ProdutoDAO;
import io.github.bonigarcia.wdm.WebDriverManager;
import massas.MassaCadastroProduto;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import variaveis.CadastroProduto;
import variaveis.ElementosEstoque;
import variaveis.VariaveisEstoque;

import java.time.Duration;

import static org.junit.Assert.assertTrue;

public class CadastroProdutoTest {
    private WebDriver driver;


    @Before
    public void iniciarTeste() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();
        driver.manage().window().maximize();

        driver.get(VariaveisEstoque.URL_ESTOQUE);
        driver.findElement(ElementosEstoque.BOTAO_CADASTRO).click();
        assertTrue(driver.findElement(ElementosEstoque
                .PG_CADASTRO_PRODUTO_ATIVA).isDisplayed());

    }

    //@After
    //public void finalizarTeste() {
    //   driver.quit();
    //}

    @Test
    public void CT02_cadastrarProdutoValido() {
        //Dado: que o usuário esteja na tela de cadastro
        String nomeProduto = MassaCadastroProduto.nomeProdutoValido();
        String cor = MassaCadastroProduto.corValida();
        String tamanho = MassaCadastroProduto.tamanhoValido();
        String sku = MassaCadastroProduto.skuValido();
        String preco = MassaCadastroProduto.precoValido();
        String quantidadeInicial = MassaCadastroProduto.quantidadeInicialValida();
        String estoqueMinimo = MassaCadastroProduto.estoqueMinimoValido();

        // Quando: preencher os campos do produto
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

        driver.findElement(CadastroProduto.INPUT_ESTOQUE_MIN)
                .sendKeys(estoqueMinimo);

        //E: Clicar no botão CadasTrar produto
        WebDriverWait wait = new WebDriverWait(driver,
                Duration.ofSeconds(10));

        wait.until(ExpectedConditions.elementToBeClickable(ElementosEstoque.BOTAO_CADASTRAR))
                .click();


        // Então: o sistema deve permitir o cadastro do produto
        WebElement mensagemSucesso = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        ElementosEstoque.TEXTO_FEEDBACK
                )
        );

        // E: exibir a mensagem de sucesso
        assertTrue(
                mensagemSucesso.getText().contains
                        ("Produto cadastrado com sucesso")
        );

        //E: o produto dever ser persistido no banco de dados
        assertTrue(
                "O produto cadastrado não foi encontrado no banco de dados.",
                ProdutoDAO.existeProdutoPorSku(sku)
        );
    }

}



