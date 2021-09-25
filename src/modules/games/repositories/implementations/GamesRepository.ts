import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const result = await this.repository
      .createQueryBuilder('game')
      .where('LOWER(game.title) like :param', { param: `%${param}%` })
      .getMany();
    return result;
    // Complete usando query builder
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query(`
      SELECT count(*) FROM games
        `); // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    return this.repository
      .createQueryBuilder('game')
      .select('user.id, user.first_name, user.last_name, user.email, user.created_at, user.updated_at')
      .innerJoin('game.users', 'user')
      .where('game.id = :id', { id })
      .getRawMany();

    // Complete usando query builder
  }
}
