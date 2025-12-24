import { Controller } from '@nestjs/common';
import { NotificationService } from './notification.service';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}
  @EventPattern('user.created')
  handleUserCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log('[EVENTO user.created] User created', data);
  }
  @EventPattern('#')
  handleEverything(@Payload() data: any, @Ctx() context: RmqContext) {
    const eventName = context.getPattern();
    console.log(`[EVENTO #] Evento global: ${eventName}`, data);
  }
  @MessagePattern('notification')
  getNotifications(data: any) {
    console.log('Notification data received:', data);
  }
}
