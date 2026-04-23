import { Module } from '@nestjs/common';
import { DraftPreviewController } from './draft-preview.controller';
import { DraftPreviewService } from './draft-preview.service';

@Module({
  controllers: [DraftPreviewController],
  providers: [DraftPreviewService],
  exports: [DraftPreviewService],
})
export class DraftPreviewModule {}
