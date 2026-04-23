import { Module } from '@nestjs/common';  
import { JobListingsController } from './job-listings.controller';  
import { JobListingsService } from './job-listings.service';  
  
@Module({  
  controllers: [JobListingsController],  
  providers: [JobListingsService],  
})  
export class JobListingsModule {} 
