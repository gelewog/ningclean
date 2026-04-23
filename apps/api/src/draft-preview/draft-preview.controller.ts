import { Controller, Post, Get, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { DraftPreviewService, DraftData } from './draft-preview.service';

@Controller('drafts')
export class DraftPreviewController {
  constructor(private readonly draftPreviewService: DraftPreviewService) {}

  @Post('preview')
  async createDraft(@Body() data: DraftData) {
    const id = this.draftPreviewService.createDraft(data);
    return { id };
  }

  @Get('preview/:id')
  async getDraft(@Param('id') id: string) {
    const draft = this.draftPreviewService.getDraft(id);

    if (!draft) {
      throw new HttpException('Draft not found or expired', HttpStatus.NOT_FOUND);
    }

    return draft;
  }
}
