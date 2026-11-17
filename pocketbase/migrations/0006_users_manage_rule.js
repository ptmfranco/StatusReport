/**
 * 0006_users_manage_rule.js
 *
 * Permite que um usuário autenticado com role = 'superusuario' gerir
 * registros de auth da coleção `users` como "manager": alterar a senha
 * de outro usuário sem enviar `oldPassword`, e ajustar `verified` etc.
 *
 * O PocketBase só aceita `password`/`passwordConfirm` sem `oldPassword`
 * (e a mudança direta de `verified`) quando a requisição tem "manage
 * access" — que, numa auth collection, vem do `manageRule`. Sem ele,
 * o PATCH da tela Usuários falha com 400 "Failed to update record."
 * (validação do campo `oldPassword`, mascarada pela mensagem genérica
 * do front-end).
 *
 * O manageRule é executado EM ADIÇÃO às regras create/update — as
 * regras existentes (0005) continuam valendo.
 */
migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    users.manageRule = "@request.auth.role = 'superusuario'"
    app.save(users)
  },
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    users.manageRule = null
    app.save(users)
  },
)
