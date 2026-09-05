import { eq, isNull } from 'drizzle-orm'
import { db, services } from '@backstage-like/db'
import type { NewService, Service } from '@backstage-like/db'

export async function findActiveServices(): Promise<Service[]> {
  return db.select().from(services).where(isNull(services.deletedAt))
}

export async function findActiveServiceById(
  id: string,
): Promise<Service | undefined> {
  const [service] = await db.select().from(services).where(eq(services.id, id))

  if (!service || service.deletedAt !== null) {
    return undefined
  }

  return service
}

export async function createService(data: NewService): Promise<Service> {
  const [service] = await db.insert(services).values(data).returning()

  return service
}

export async function updateService(
  id: string,
  data: Pick<NewService, 'name' | 'description'>,
): Promise<Service | undefined> {
  const [service] = await db
    .update(services)
    .set({
      name: data.name,
      description: data.description,
      updatedAt: new Date(),
    })
    .where(eq(services.id, id))
    .returning()

  if (!service || service.deletedAt !== null) {
    return undefined
  }

  return service
}

export async function deleteService(id: string): Promise<Service | undefined> {
  const [service] = await db
    .update(services)
    .set({
      deletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(services.id, id))
    .returning()

  if (!service || service.deletedAt === null) {
    return undefined
  }

  return service
}
