package variaveis;

import org.openqa.selenium.By;

public class ElementosEstoque {
    public static final By PG_DASHBOARD_ATIVA =
            By.cssSelector("#page-dashboard.active");

    public static final By BOTAO_CADASTRO =
            By.cssSelector(".menu-button[data-page=produtos]");

    public static final  By PG_CADASTRO_PRODUTO_ATIVA =
            By.cssSelector("#page-produtos.active");

    public static final By BOTAO_CADASTRAR =
            By.id("btnCadastrarProduto");

    public static final By MENSAGEM_SUCESSO =
            By.id("feedbackMessage");

    public static final By TEXTO_FEEDBACK =
            By.id("feedbackText");

}
