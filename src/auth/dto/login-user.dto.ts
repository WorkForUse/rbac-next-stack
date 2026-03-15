import { Role } from '../../roles/entities/role.entity';
import { Permission } from '../../permissions/entities/permission.entity';

export class LoginUserDto {
  id: number;
  email: string;
  role: Role;
  status: string;
  permissions: Permission[];
}
