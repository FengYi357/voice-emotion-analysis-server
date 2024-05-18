import { UserDocument } from 'src/servers/user/entities/user.entity';

export type UserPublic = Omit<UserDocument, 'password' | 'salt' | '__v'>;

export enum Role {
  SysAdmin = 'sys_admin',
  Admin = 'admin',
  User = 'user',
}
