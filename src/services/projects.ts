import pb from '@/lib/pocketbase/client'
import type { ProjectRecord, TaskRecord, ProjectMemberRecord } from '@/types/database'

export const projectsService = {
  async list(): Promise<ProjectRecord[]> {
    return pb.collection('projects').getFullList<ProjectRecord>({
      sort: '-created',
      expand: 'owner',
    })
  },

  async getById(id: string): Promise<ProjectRecord> {
    return pb.collection('projects').getOne<ProjectRecord>(id, {
      expand: 'owner',
    })
  },

  async create(data: Partial<ProjectRecord>): Promise<ProjectRecord> {
    return pb.collection('projects').create<ProjectRecord>(data)
  },

  async update(id: string, data: Partial<ProjectRecord>): Promise<ProjectRecord> {
    return pb.collection('projects').update<ProjectRecord>(id, data)
  },

  async delete(id: string): Promise<boolean> {
    return pb.collection('projects').delete(id)
  },

  async getMembers(projectId: string): Promise<ProjectMemberRecord[]> {
    return pb.collection('project_members').getFullList<ProjectMemberRecord>({
      filter: `project = '${projectId}'`,
      expand: 'user',
    })
  },

  async addMember(
    projectId: string,
    userId: string,
    role = 'membro',
  ): Promise<ProjectMemberRecord> {
    return pb.collection('project_members').create<ProjectMemberRecord>({
      project: projectId,
      user: userId,
      role,
    })
  },

  async removeMember(memberId: string): Promise<boolean> {
    return pb.collection('project_members').delete(memberId)
  },
}

export const tasksService = {
  async listAll(): Promise<TaskRecord[]> {
    return pb.collection('tasks').getFullList<TaskRecord>({
      sort: 'order,created',
      expand: 'project,assigned_to',
    })
  },

  async listByProject(projectId: string): Promise<TaskRecord[]> {
    return pb.collection('tasks').getFullList<TaskRecord>({
      filter: `project = '${projectId}'`,
      sort: 'order,created',
      expand: 'assigned_to',
    })
  },

  async create(data: Partial<TaskRecord>): Promise<TaskRecord> {
    return pb.collection('tasks').create<TaskRecord>(data)
  },

  async update(id: string, data: Partial<TaskRecord>): Promise<TaskRecord> {
    return pb.collection('tasks').update<TaskRecord>(id, data)
  },

  async delete(id: string): Promise<boolean> {
    return pb.collection('tasks').delete(id)
  },
}
