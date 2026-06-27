import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import variaveis.ElementosEstoque;
import variaveis.VariaveisEstoque;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class NavegacaoEstoqueTest {
    private WebDriver driver;

    @Before
    public void iniciarTeste() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();
        driver.manage().window().maximize();
    }

    @After
    public void finalizarTeste() {
     driver.quit();
    }

    @Test
    public void CT01_estoqueTelaInicial() {

        //Dado: que o usuário acesse a página inicial do módulo estoque
        driver.get(VariaveisEstoque.URL_ESTOQUE);

        //Então: a URL exibida deve ser a esperada do módulo estoque
        assertEquals(VariaveisEstoque.URL_ESTOQUE, driver.getCurrentUrl());

        //E: o título da página deve estar visível para o usuário
        assertEquals(VariaveisEstoque.TITULO_ESTOQUE, driver.getTitle());

        //E: a página dashboard deve estar visível para o usuário
        assert driver.findElement(ElementosEstoque.PG_DASHBOARD_ATIVA).isDisplayed();

    }

    @Test
    public void CT02_estoqueMenuCadastro() {
        //Dado: que o usuário esteja na página inicial do módulo estoque
        driver.get(VariaveisEstoque.URL_ESTOQUE);

        //E: o Dashboard esteja visível para o usuário
        assertTrue(
                driver.findElement(ElementosEstoque.PG_DASHBOARD_ATIVA).isDisplayed());

        //Quando: clicar no botão Cadastrar Produto no menu lateral
        driver.findElement(ElementosEstoque.BOTAO_CADASTRO).click();

        //Então: a página de cadastro deve ficar ativa
        assertTrue
                (driver.findElement(ElementosEstoque.PG_CADASTRO_PRODUTO_ATIVA)
                        .isDisplayed());
    }

}

