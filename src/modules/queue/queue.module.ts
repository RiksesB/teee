import { Module } from '@nestjs/common';
import { InMemoryQueueService } from './in-memory-queue.service';

@Module({
  providers: [InMemoryQueueService],
  exports: [InMemoryQueueService],
})
export class QueueModule {}
