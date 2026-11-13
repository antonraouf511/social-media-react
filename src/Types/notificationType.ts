export interface UserType {
  _id: string;
  name: string;
  photo: string;
}

export interface EntityType {
  _id: string;
  body: string;
  image: string;
  user: string;
  commentsCount: number;
  [key: string]: any;
}

export interface NotificationType {
  _id: string;
  actor: UserType;
  createdAt: string;
  entity: EntityType;
  entityId: string;
  entityType: string;
  isRead: boolean;
  recipient: UserType;
  type: string;
}