package massas;

import net.datafaker.Faker;

public class MassaCadastroProduto {
    private static final Faker faker = new Faker();

    public static String nomeProdutoValido() {
        return "Camiseta " + faker.number().numberBetween(100, 999);
    }

    public static String corValida() {
        return "Azul";
    }

    public static String tamanhoValido() {
        return "M";
    }

    public static String skuValido() {
        return "CAM" + faker.number().numberBetween(100, 999) + "-AZUL-M";
    }

    public static String precoValido() {
        return "59.90";
    }

    public static String quantidadeInicialValida() {
        return "20";
    }

    public static String estoqueMinimoValido() {
        return "10";
    }

    public static String estoqueMinimoNegativo() {
        return "-1";
    }

    public static String estoqueMinimoDecimal() {
        return "10.5";
    }

    public static String estoqueMinimoTexto() {
        return "abc";
    }

    public static String estoqueMinimoVazio() {
        return "";
    }

    public static String novoPrecoValidoEdicao() {
        return "69.90";
    }
}
