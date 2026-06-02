import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

import static org.junit.Assert.assertEquals;

public class NavegacaoEstoqueTest {
    private WebDriver driver;

    @Before
    public void iniciarTeste() {
        driver = new ChromeDriver();

    }

    @After
    public void finalizarTeste() {
        driver.quit();
    }


    @Test
    public void CT01_estoque_dashboard() {

        //Dado: que o usuário esteja na página http://127.0.0.1:5500/frontend/index.html
        driver.manage().window().setSize(new Dimension(VariaveisEstoque.LARGURA_TELA, VariaveisEstoque.ALTURA_TELA));
        driver.get(VariaveisEstoque.URL_ESTOQUE);
        assertEquals(VariaveisEstoque.URL_ESTOQUE, driver.getCurrentUrl());
        assertEquals(VariaveisEstoque.TITULO_ESTOQUE, driver.getTitle());
        assert driver.findElement(ElementosEstoque.PG_DASHBOARD_ATIVA).isDisplayed();

        //Quando: clicar no botão cadastrar produto no menu lateral
        driver.findElement(ElementosEstoque.BOTAO_CADASTRO).click();

        //Então: a página de cadastro deve ficar ativa
        assert driver.findElement(ElementosEstoque.PG_CADASTRO_PRODUTO_ATIVA).isDisplayed();

    }
}

