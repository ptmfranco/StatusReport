migrate(
  (app) => {
    // 1. Coleção 'projects'
    const projects = new Collection({
      name: 'projects',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != '' && owner = @request.auth.id",
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'description', type: 'text' },
        {
          name: 'status',
          type: 'select',
          required: true,
          values: ['planejamento', 'em_andamento', 'concluido'],
          maxSelect: 1,
        },
        {
          name: 'owner',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          maxSelect: 1,
          cascadeDelete: false,
        },
        { name: 'cover_color', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_projects_status ON projects (status)',
        'CREATE INDEX idx_projects_owner ON projects (owner)',
      ],
    })
    app.save(projects)

    const projectsId = app.findCollectionByNameOrId('projects').id

    // 2. Coleção 'project_members'
    const members = new Collection({
      name: 'project_members',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        {
          name: 'project',
          type: 'relation',
          required: true,
          collectionId: projectsId,
          maxSelect: 1,
          cascadeDelete: true,
        },
        {
          name: 'user',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          maxSelect: 1,
          cascadeDelete: true,
        },
        { name: 'role', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_pm_project ON project_members (project)',
        'CREATE INDEX idx_pm_user ON project_members (user)',
      ],
    })
    app.save(members)

    // 3. Coleção 'tasks'
    const tasks = new Collection({
      name: 'tasks',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text' },
        {
          name: 'status',
          type: 'select',
          required: true,
          values: ['todo', 'doing', 'done'],
          maxSelect: 1,
        },
        {
          name: 'priority',
          type: 'select',
          required: true,
          values: ['baixa', 'media', 'alta'],
          maxSelect: 1,
        },
        {
          name: 'project',
          type: 'relation',
          required: true,
          collectionId: projectsId,
          maxSelect: 1,
          cascadeDelete: true,
        },
        {
          name: 'assigned_to',
          type: 'relation',
          collectionId: '_pb_users_auth_',
          maxSelect: 1,
          cascadeDelete: false,
        },
        { name: 'due_date', type: 'date' },
        { name: 'order', type: 'number' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_tasks_status ON tasks (status)',
        'CREATE INDEX idx_tasks_project ON tasks (project)',
        'CREATE INDEX idx_tasks_assigned_to ON tasks (assigned_to)',
        'CREATE INDEX idx_tasks_due_date ON tasks (due_date)',
      ],
    })
    app.save(tasks)
  },
  (app) => {
    try {
      const tasks = app.findCollectionByNameOrId('tasks')
      app.delete(tasks)
    } catch (_) {}
    try {
      const members = app.findCollectionByNameOrId('project_members')
      app.delete(members)
    } catch (_) {}
    try {
      const projects = app.findCollectionByNameOrId('projects')
      app.delete(projects)
    } catch (_) {}
  },
)
