import { Module } from '@nestjs/common';  
  
import { PricingPlansController } from './pricing-plans.controller';  
import { PricingPlansService } from './pricing-plans.service';  
  
@Module({  
  controllers: [PricingPlansController],  
  providers: [PricingPlansService],  
})  
export class PricingPlansModule {} 
