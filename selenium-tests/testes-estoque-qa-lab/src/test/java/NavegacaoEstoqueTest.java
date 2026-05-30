import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

public class NavegacaoEstoqueTest {
    @Test
    public void carregarTelaDashboardENavegarParaCadastroProduto(){

        //Dado: que o usuário esteja na página http://127.0.0.1:5500/frontend/index.html
        WebDriver driver = new ChromeDriver();
        driver.manage().window().setSize(new Dimension(1366, 768));
        driver.get("http://127.0.0.1:5500/frontend/index.html");
        assert driver.getCurrentUrl().equals("http://127.0.0.1:5500/frontend/index.html");
        assert driver.getTitle().equals("VarejoSync | Módulo de Estoque");
        assert driver.findElement(By.cssSelector("#page-dashboard.active")).isDisplayed();

        //Quando: clicar no botão cadastrar produto no menu lateral
        driver.findElement(By.xpath("//nav[@class='menu']" +
                "//button[normalize-space()='Cadastrar Produto']")).click();

        //Então: a página de cadastro deve ficar ativa
        assert driver.findElement(By.cssSelector("#page-produtos.active")).isDisplayed();

        driver.quit();
    }
}
