import { Module } from '@nestjs/common';  
import { CompanyStatsService } from './company-stats.service';  
import { CompanyStatsController } from './company-stats.controller';  
import { PrismaModule } from '../prisma/prisma.module';  
  
@Module({  
  imports: [PrismaModule],  
  controllers: [CompanyStatsController],  
  providers: [CompanyStatsService],  
  exports: [CompanyStatsService],  
})  
export class CompanyStatsModule {} 
