import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async resolvePermissions(userId: number): Promise<string[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['role', 'role.permissions', 'permissions'],
    });

    if (!user) {
      throw new Error('User not found');
    }

    const rolePerms = user.role ? user.role.permissions.map((p: Permission) => p.name) : [];
    const userPerms = user.permissions.map((p: Permission) => p.name);

    return Array.from(new Set([...rolePerms, ...userPerms]));
  }

  async findAllPermissions(): Promise<Permission[]> {
    return this.permissionRepository.find();
  }

  async grantPermissionToUser(targetUserId: number, permName: string, granterId: number): Promise<void> {
    const targetUser = await this.userRepository.findOne({
      where: { id: targetUserId },
      relations: ['permissions'],
    });
    if (!targetUser) throw new Error('Target user not found');

    const granterPermissions = await this.resolvePermissions(granterId);
    if (!granterPermissions.includes(permName)) {
      throw new Error('Granter does not have permission to grant this');
    }

    const permission = await this.permissionRepository.findOne({ where: { name: permName } });
    if (!permission) throw new Error('Permission not found');

    targetUser.permissions.push(permission);
    await this.userRepository.save(targetUser);
  }

  async revokePermissionFromUser(targetUserId: number, permName: string): Promise<void> {
    const targetUser = await this.userRepository.findOne({
      where: { id: targetUserId },
      relations: ['permissions'],
    });
    if (!targetUser) throw new Error('Target user not found');

    targetUser.permissions = targetUser.permissions.filter(p => p.name !== permName);
    await this.userRepository.save(targetUser);
  }
}
