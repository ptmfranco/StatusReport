/* 0005 — Ajuste fino das regras da coleção users para a tela "Usuários" do app:
   - Superusuário autenticado pode gerenciar outros usuários (criar, editar,
     redefinir senha, excluir) via API, sem poder escalar o próprio role.
   - E-mail visível na listagem (emailVisibility = true nos seeds). */
migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('_pb_users_auth_')
    const SUPER = "@request.auth.role = 'superusuario'"

    // Lista/detalhe: cada um vê a si mesmo; Superusuário vê todos.
    col.listRule = 'id = @request.auth.id || ' + SUPER
    col.viewRule = 'id = @request.auth.id || ' + SUPER

    // Self-update: pode editar o próprio perfil, mas nunca o próprio role.
    col.updateRule =
      '(id = @request.auth.id && @request.body.role:changed = false && @request.body.verified:changed = false) || ' +
      SUPER

    // Create/delete apenas para o Superusuário (gerenciamento de acessos).
    col.createRule = SUPER
    col.deleteRule = SUPER + ' && id != @request.auth.id'

    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('_pb_users_auth_')
    col.listRule = "id = @request.auth.id || @request.auth.role = 'superusuario'"
    col.viewRule = "id = @request.auth.id || @request.auth.role = 'superusuario'"
    col.createRule = "@request.auth.role = 'superusuario'"
    col.updateRule =
      'id = @request.auth.id && @request.body.role:changed = false && @request.body.verified:changed = false'
    col.deleteRule = "@request.auth.role = 'superusuario' && id != @request.auth.id"
    app.save(col)
  },
)
