import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Permission } from '../permissions/entities/permission.entity';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // TODO: Hash password with bcrypt before save
    try {
      const user = this.userRepository.create(createUserDto);

      // Assign basic permissions for dynamic users (fully dynamic access)
      const basicPermNames = [
        'view_dashboard',
        'view_leads',
        'view_tasks', 
        'view_reports',
        'view_users'
      ];
      const basicPerms = await this.permissionRepository.find({
        where: basicPermNames.map(name => ({ name: name }))
      });
      user.permissions = basicPerms;

      const savedUser = await this.userRepository.save(user);
      // Load with relations for complete user data
      return this.userRepository.findOneOrFail({
        where: { id: savedUser.id },
        relations: ['role', 'permissions']
      });
    } catch (err) {
      console.error('User creation failed:', err);
      throw err;
    }
  }

  // Suspend or Ban User 
  async updateUserStatus(creator, targetUserId: string, status: string) {
    const user = await this.userRepository.findOne({ where: { id: +targetUserId } });
    if (!user) throw new NotFoundException();

    if (creator.role === 'Manager' && user.role?.name === 'Admin') {
      throw new ForbiddenException("You cannot modify an Admin's status.");
    }

    user.status = status;
    await this.userRepository.save(user);
    
    // await this.auditLogService.logAction(creator.id, 'STATUS_CHANGE', `User ${user.id} set to ${status}`);
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findOne({ 
      where: { email },
      relations: ['role', 'permissions']
    });
    if (user && user.password === password) {  // TODO: use bcrypt.compare
      const { password: _, ...result } = user;
      return {
        ...result,
        role: user.role?.name || 'User'  // Serialize role name for JWT
      };
    }
    return null;
  }

  findAll() {
    return this.userRepository.find({ relations: ['permissions', 'role'] });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ 
      where: { id: +id },
      relations: ['permissions', 'role']
    });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return user;
  }

  async findById(id: number): Promise<User> {
    return this.userRepository.findOneOrFail({ where: { id } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    // TODO: Hash password if provided
    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async updateUserPermissions(targetUserId: string, requestedPermissions: string[]): Promise<User> {
    const user = await this.findOne(targetUserId);

    // Fetch permission entities by name
    const permissions = await this.permissionRepository.find({
      where: requestedPermissions.map(name => ({ name }))
    });
    user.permissions = permissions;
    await this.userRepository.save(user);
    return user;
  }

  // Helper: Return user with permissions as string names for frontend
  async findAllWithPermissionNames() {
    const users = await this.userRepository.find({ 
      relations: ['permissions', 'role'] 
    });
    return users.map(user => ({
      ...user,
      permissions: user.permissions?.map(p => p.name) || []
    }));
  }
}