package database;

import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.*;

public class ProdutoDAO {
    private static final String CAMINHO_BANCO =
            "C:/estoque-qa-lab/backend/db/estoque_qa_lab.db";

    private static final String URL_BANCO =
            "jdbc:sqlite:" + CAMINHO_BANCO;


    private static Connection conectar() {
        try {
            if (!Files.exists(Path.of(CAMINHO_BANCO))) {
                throw new RuntimeException(
                        "Arquivo do banco não encontrado no caminho: " + CAMINHO_BANCO
                );
            }

            return DriverManager.getConnection(URL_BANCO);

        } catch (Exception erro) {
            throw new RuntimeException
                    ("Erro ao conectar no banco SQLite.", erro);
        }
    }

    public static boolean testarConexao() {
        try (Connection conexao = conectar()) {
            return conexao != null;


        } catch (Exception erro) {
            throw new RuntimeException
                    ("Falha ao testar conexão com SQlite!", erro);
        }
    }

    public static boolean existeProdutoPorSku(String sku) {
        String sql = "SELECT COUNT(*) FROM variacao_produto WHERE sku = ?";
        try (Connection conexao = conectar();
             PreparedStatement statement = conexao.prepareStatement(sql)) {
            statement.setString(1, sku);
            try (ResultSet resultado = statement.executeQuery()) {
                if (resultado.next()) {
                    int quantidadeEncontrada = resultado.getInt(1);
                    return quantidadeEncontrada > 0;

                }

            }

        } catch (Exception erro) {
            throw new RuntimeException("Erro ao consultar produto por sku!", erro);
        }
        return false;
    }

    public static boolean existeProdutoComPreco(String sku, String precoEsperado) {
        String sql = """
               SELECT COUNT(*) 
               FROM variacao_produto 
               WHERE sku = ? 
                 AND CAST(preco AS REAL) = ?
               """;

        try (Connection conexao = conectar();
             PreparedStatement statement = conexao.prepareStatement(sql)) {

            statement.setString(1, sku);
            statement.setDouble(2, Double.parseDouble(precoEsperado));

            try (ResultSet resultado = statement.executeQuery()) {
                if (resultado.next()) {
                    int quantidadeEncontrada = resultado.getInt(1);
                    return quantidadeEncontrada > 0;
                }
            }

        } catch (Exception erro) {
            throw new RuntimeException
                    ("Erro ao consultar produto editado" +
                            " por SKU e preço!", erro);
        }

        return false;
    }


    public static boolean produtoEstaAtivoPorSku(String sku) {
        String sql = """
            SELECT p.ativo
            FROM produto p
            INNER JOIN variacao_produto vp
                    ON vp.id_produto = p.id_produto
            WHERE vp.sku = ?
            """;

        try (Connection conexao = conectar();
             PreparedStatement statement = conexao.prepareStatement(sql)) {

            statement.setString(1, sku);

            try (ResultSet resultado = statement.executeQuery()) {
                if (resultado.next()) {
                    return resultado.getInt("ativo") == 1;
                }
            }

        } catch (Exception erro) {
            throw new RuntimeException(
                    "Erro ao consultar status ativo do produto por SKU.",
                    erro
            );
        }

        return false;
    }



}
