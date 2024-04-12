import { Role } from 'src/types';

export class CreateUserDto {
  readonly username: string;
  readonly password: string;
  readonly role: Role;
  readonly avatar?: string;
}
