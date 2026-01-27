import { Injectable } from '@nestjs/common';
import { RoleRepository } from '../repositories/role.repository';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  getAll() {
    return this.roleRepository.getAll();
  }

  getByName(name: string) {
    this.roleRepository.getByName(name);
  }

  getById(id: string) {
    this.roleRepository.getById(id);
  }
}
