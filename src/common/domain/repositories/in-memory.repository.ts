import { randomUUID } from 'crypto'
import { RepositoryInterface, SearchInput, SearchOutput } from './repository.interface'

export type ModelProps = {
  id: string
  [key: string]: any
}

export type CreateProps = {
  [key: string]: any
}

export abstract class InMemoryRepositoryInterface
  implements RepositoryInterface<CreateProps, ModelProps>
{
  items: ModelProps[] = []
  sortableFields: string[] = []

  // Cria um novo item em memória
  create(props: CreateProps): ModelProps {
    const model = {
      id: randomUUID(),
      created_at: new Date(),
      updated_at: new Date(),
      ...props,
    }
    return model as ModelProps
  }

  // Insere um item no array
  async insert(model: ModelProps): Promise<ModelProps> {
    this.items.push(model)
    return model
  }

  // Busca item por id
  async findById(id: string): Promise<ModelProps> {
    return this._get(id)
  }

  // Atualiza item existente
  async update(model: ModelProps): Promise<ModelProps> {
    await this._get(model.id)
    const index = this.items.findIndex((item) => item.id === model.id)
    this.items[index] = model
    return model
  }

  // Remove item por id
  async delete(id: string): Promise<void> {
    await this._get(id)
    this.items = this.items.filter((item) => item.id !== id)
  }

  // Busca com paginação, filtro e ordenação
  async search(props: SearchInput): Promise<SearchOutput<ModelProps>> {
    const page = props.page ?? 1
    const per_page = props.limit ?? 15
    const sort = props.sort ?? null
    const sort_dir = props.sort_dir ?? null
    const filter = props.filter ?? null

    const filteredItems = await this.applyFilter(this.items, filter)
    const orderedItems = await this.applySort(filteredItems, sort, sort_dir)
    const paginatedItems = await this.applyPaginate(orderedItems, page, per_page)

    return {
      items: paginatedItems,
      total: filteredItems.length,
      current_page: page,
      per_page,
      sort,
      sort_dir,
      filter,
    }
  }

  // Método interno para garantir que o item existe
  protected async _get(id: string): Promise<ModelProps> {
    const item = this.items.find((item) => item.id === id)
    if (!item) {
      throw new Error(`Item with id ${id} not found`)
    }
    return item
  }

  // Métodos que podem ser sobrescritos pelas subclasses
  protected abstract applyFilter(
    items: ModelProps[],
    filter: Record<string, any> | null,
  ): Promise<ModelProps[]>

  protected async applySort(
    items: ModelProps[],
    sort: string | null,
    sort_dir: string | null,
  ): Promise<ModelProps[]> {
    if (!sort || !this.sortableFields.includes(sort)) {
      return items
    }

    return [...items].sort((a, b) => {
      if (a[sort] < b[sort]) return sort_dir === 'asc' ? -1 : 1
      if (a[sort] > b[sort]) return sort_dir === 'asc' ? 1 : -1
      return 0
    })
  }

  protected async applyPaginate(
    items: ModelProps[],
    page: number,
    per_page: number,
  ): Promise<ModelProps[]> {
    const start = (page - 1) * per_page
    const end = start + per_page
    return items.slice(start, end)
  }
}
