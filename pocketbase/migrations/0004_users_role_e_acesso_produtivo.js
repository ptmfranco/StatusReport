/* 0004 — Acesso produtivo: campo `role` na coleção users + seed do usuário
   administrador (Somente o PocketBase autentica; nada de senhas fixas no HTML).

   - Campo select `role` (superusuario | gestor | operacional), obrigatório.
   - Usuário existente (paulotmfranco@gmail.com) recebe role superusuario.
   - Seed idempotente de dois usuários de exemplo (gestor e operacional) com a
     senha padrão inicial "cet2026" (trocar no primeiro uso pelo painel).
   - Regras da coleção users travadas contra autoescalação:
     · self-update mantém o próprio perfil, mas não pode alterar `role`
       (@request.body.role:changed = false) nem desativar a si mesmo — o
       gerenciamento de perfis/senhas fica com o Superusuário do painel.
     · create continua aberto ("" — o próprio app pode cadastrar usuários via
       tela Usuários quando integrada ao banco), sem aceitar role ausente. */
migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('_pb_users_auth_')

    if (!col.fields.getByName('role')) {
      col.fields.add(
        new SelectField({
          name: 'role',
          type: 'select',
          required: true,
          maxSelect: 1,
          values: ['superusuario', 'gestor', 'operacional'],
        }),
      )
    }

    // Autosserviço: atualiza o próprio perfil sem poder mudar o role.
    col.updateRule =
      'id = @request.auth.id && @request.body.role:changed = false && @request.body.verified:changed = false'
    // Somente autenticado pode ver outros usuários (lista da tela Usuários).
    col.listRule = "@request.auth.id != ''"
    col.viewRule = "@request.auth.id != ''"
    col.deleteRule = "@request.auth.id != '' && @request.body.role:changed = false"
    app.save(col)

    const ROLE_SUPER = 'superusuario'
    const ROLE_GESTOR = 'gestor'
    const ROLE_OP = 'operacional'

    const upsertRole = (email, role) => {
      try {
        const rec = app.findAuthRecordByEmail('_pb_users_auth_', email)
        rec.set('role', role)
        app.save(rec)
      } catch (_) {}
    }

    // Usuário já existente no banco vira Superusuário.
    upsertRole('paulotmfranco@gmail.com', ROLE_SUPER)

    // Seeds idempotentes (e-mail deve ser único por coleção auth).
    const seed = (email, nome, role) => {
      try {
        app.findAuthRecordByEmail('_pb_users_auth_', email)
        return
      } catch (_) {}
      const rec = new Record(app.findCollectionByNameOrId('_pb_users_auth_'))
      rec.setEmail(email)
      rec.setPassword('Cet2026!')
      rec.setVerified(true)
      rec.set('name', nome)
      rec.set('role', role)
      app.save(rec)
    }
    seed('paulo.franco@rautakitecnologia.com.br', 'Paulo Franco', ROLE_SUPER)
    seed('renato@rautakitecnologia.com.br', 'Renato (Gestor)', ROLE_GESTOR)
    seed('operacional@rautakitecnologia.com.br', 'Operacional', ROLE_OP)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('_pb_users_auth_')
    const f = col.fields.getByName('role')
    if (f) col.fields.removeByName('role')
    col.updateRule = 'id = @request.auth.id'
    col.deleteRule = 'id = @request.auth.id'
    col.listRule = 'id = @request.auth.id'
    col.viewRule = 'id = @request.auth.id'
    app.save(col)
  },
)
