import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
export default class UsersController {
  /**
   * Get own personal workspace
   */
  public async getWorkspace ({ auth }: HttpContextContract) {
    const user = auth.user!

    const workspace = await user
      .related('workspaces')
      .query()
      .where('user_id', user.id)
      .andWhere('is_personal', true)
      .preload('members', (query) => query.pivotColumns(['role']))
      .preload('links', (query) => {
        query.preload('user')
        query.preload('clicks', (query) => {
          query.orderBy('createdAt', 'asc')
        })
        query.preload('tags')
      })
      .preload('clicks')
      .firstOrFail()

    return workspace
  }

  /**
   * Return all workspaces of user (owner/member)
   */
  public async getWorkspaces ({ auth }: HttpContextContract) {
    const user = auth.user!

    const data = await user
      .related('workspaces')
      .query()
      .where('user_id', user.id)

    const workspaceList = [] as object[]
    data.forEach(ws => {
      workspaceList.push({
        id: ws.id,
        name: ws.name,
        color: ws.color,
      })
    })

    return workspaceList
  }
}
