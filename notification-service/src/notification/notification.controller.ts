import { Controller } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}
  @MessagePattern('notification')
  getNotifications(data: any) {
    console.log('Notification data received:', data);
  }
}
