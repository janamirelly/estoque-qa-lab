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

    public static boolean existeProdutoComEstoqueMinimo(String sku, String novoEstoqueMinimo) {
        String sql = """
            SELECT COUNT(*)
            FROM variacao_produto vp
            INNER JOIN estoque e
                ON e.id_variacao = vp.id_variacao
            WHERE vp.sku = ?
              AND e.estoque_min = ?
            """;

        try (Connection conexao = conectar();
             PreparedStatement statement = conexao.prepareStatement(sql)) {

            statement.setString(1, sku);
            statement.setInt(2, Integer.parseInt(novoEstoqueMinimo));

            try (ResultSet resultado = statement.executeQuery()) {
                if (resultado.next()) {
                    return resultado.getInt(1) > 0;
                }
            }

        } catch (Exception erro) {
            throw new RuntimeException
                    ("Erro ao consultar estoque minímo por SKU"
                            , erro);
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

    public static int obterIdProdutoPorSku(String sku) {
        String sql = """
            SELECT vp.id_produto
            FROM variacao_produto vp
            WHERE vp.sku = ?
            """;

        try (Connection conexao = conectar();
             PreparedStatement statement = conexao.prepareStatement(sql)) {

            statement.setString(1, sku);

            try (ResultSet resultado = statement.executeQuery()) {
                if (resultado.next()) {
                    return resultado.getInt("id_produto");
                }
            }

        } catch (Exception erro) {
            throw new RuntimeException(
                    "Erro ao consultar id_produto por SKU.",
                    erro
            );
        }

        return -1;
    }

    public static boolean variacaoEstaAtivaPorSku(String sku) {
        String sql = """
        SELECT ativo
        FROM variacao_produto
        WHERE sku = ?
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
                    "Erro ao consultar status ativo da variação por SKU.",
                    erro
            );
        }

        return false;
    }





}
