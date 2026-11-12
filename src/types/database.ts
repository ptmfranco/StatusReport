import type { RecordModel } from 'pocketbase'

export interface UserRecord extends RecordModel {
  email: string
  name: string
  avatar?: string
}

export type ProjectStatus = 'planejamento' | 'em_andamento' | 'concluido'

export interface ProjectRecord extends RecordModel {
  name: string
  description?: string
  status: ProjectStatus
  owner: string
  cover_color?: string
  expand?: {
    owner?: UserRecord
  }
}

export type TaskStatus = 'todo' | 'doing' | 'done'
export type TaskPriority = 'baixa' | 'media' | 'alta'

export interface TaskRecord extends RecordModel {
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  project: string
  assigned_to?: string
  due_date?: string
  order?: number
  expand?: {
    project?: ProjectRecord
    assigned_to?: UserRecord
  }
}

export interface ProjectMemberRecord extends RecordModel {
  project: string
  user: string
  role?: string
  expand?: {
    user?: UserRecord
    project?: ProjectRecord
  }
}
