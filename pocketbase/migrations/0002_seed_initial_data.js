migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    const projects = app.findCollectionByNameOrId('projects')
    const projectMembers = app.findCollectionByNameOrId('project_members')
    const tasks = app.findCollectionByNameOrId('tasks')

    // 1. Garantir que o usuário admin existe
    let adminUser
    try {
      adminUser = app.findAuthRecordByEmail('_pb_users_auth_', 'paulotmfranco@gmail.com')
    } catch (_) {
      adminUser = new Record(users)
      adminUser.setEmail('paulotmfranco@gmail.com')
      adminUser.setPassword('Skip@Pass')
      adminUser.setVerified(true)
      adminUser.set('name', 'Paulo Franco')
      app.save(adminUser)
    }

    // 2. Projeto 1: "Lançamento do Site Institucional"
    let proj1
    const existingProj1 = app.findRecordsByFilter(
      'projects',
      "name = 'Lançamento do Site Institucional'",
      '',
      1,
      0,
    )
    if (existingProj1.length > 0) {
      proj1 = existingProj1[0]
    } else {
      proj1 = new Record(projects)
      proj1.set('name', 'Lançamento do Site Institucional')
      proj1.set(
        'description',
        'Desenvolvimento, revisão de conteúdo e publicação do novo portal corporativo.',
      )
      proj1.set('status', 'em_andamento')
      proj1.set('owner', adminUser.id)
      proj1.set('cover_color', '#4F46E5')
      app.save(proj1)

      // Membro do projeto
      const member1 = new Record(projectMembers)
      member1.set('project', proj1.id)
      member1.set('user', adminUser.id)
      member1.set('role', 'Líder de Projeto')
      app.save(member1)

      // Tarefas do projeto 1
      const taskData1 = [
        {
          title: 'Definir paleta de cores e tipografia',
          description: 'Alinhar diretrizes visuais com a equipe de design e branding.',
          status: 'done',
          priority: 'alta',
          order: 1,
          due_date: '2025-04-10 18:00:00.000Z',
        },
        {
          title: 'Criar protótipo de alta fidelidade',
          description: 'Construir telas principais no Figma com componentes reutilizáveis.',
          status: 'doing',
          priority: 'alta',
          order: 2,
          due_date: '2025-04-20 18:00:00.000Z',
        },
        {
          title: 'Desenvolver páginas institucionais no frontend',
          description: 'Implementar Home, Sobre Nós, Serviços e Contato com responsividade.',
          status: 'doing',
          priority: 'media',
          order: 3,
          due_date: '2025-04-28 18:00:00.000Z',
        },
        {
          title: 'Testes de usabilidade e performance',
          description: 'Rodar Lighthouse e testes com 5 usuários reais antes do go-live.',
          status: 'todo',
          priority: 'baixa',
          order: 4,
          due_date: '2025-05-05 18:00:00.000Z',
        },
      ]

      for (const t of taskData1) {
        const task = new Record(tasks)
        task.set('title', t.title)
        task.set('description', t.description)
        task.set('status', t.status)
        task.set('priority', t.priority)
        task.set('project', proj1.id)
        task.set('assigned_to', adminUser.id)
        task.set('order', t.order)
        task.set('due_date', t.due_date)
        app.save(task)
      }
    }

    // 3. Projeto 2: "Reforma do App Mobile"
    const existingProj2 = app.findRecordsByFilter(
      'projects',
      "name = 'Reforma do App Mobile'",
      '',
      1,
      0,
    )
    if (existingProj2.length === 0) {
      const proj2 = new Record(projects)
      proj2.set('name', 'Reforma do App Mobile')
      proj2.set(
        'description',
        'Modernização da arquitetura, fluxo de autenticação e performance das listas.',
      )
      proj2.set('status', 'planejamento')
      proj2.set('owner', adminUser.id)
      proj2.set('cover_color', '#0EA5E9')
      app.save(proj2)

      const member2 = new Record(projectMembers)
      member2.set('project', proj2.id)
      member2.set('user', adminUser.id)
      member2.set('role', 'Product Manager')
      app.save(member2)

      const taskData2 = [
        {
          title: 'Mapeamento da jornada do usuário atual',
          description: 'Levantar principais dores e atritos relatados no suporte ao cliente.',
          status: 'done',
          priority: 'media',
          order: 1,
          due_date: '2025-04-12 18:00:00.000Z',
        },
        {
          title: 'Benchmark de concorrentes',
          description: 'Análise comparativa das 3 principais soluções do mercado.',
          status: 'todo',
          priority: 'baixa',
          order: 2,
          due_date: '2025-04-25 18:00:00.000Z',
        },
        {
          title: 'Definição do backlog e MVP v2',
          description: 'Priorizar épicos e histórias de usuário com a liderança técnica.',
          status: 'todo',
          priority: 'alta',
          order: 3,
          due_date: '2025-05-02 18:00:00.000Z',
        },
      ]

      for (const t of taskData2) {
        const task = new Record(tasks)
        task.set('title', t.title)
        task.set('description', t.description)
        task.set('status', t.status)
        task.set('priority', t.priority)
        task.set('project', proj2.id)
        task.set('assigned_to', adminUser.id)
        task.set('order', t.order)
        task.set('due_date', t.due_date)
        app.save(task)
      }
    }
  },
  (app) => {
    // down logic opcional
  },
)
