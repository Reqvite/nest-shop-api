import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {Order, OrderSchema} from '../cart/model/order.model';
import {DashboardController} from './dashboard.controller';
import {DashboardService} from './dashboard.service';

@Module({
  imports: [MongooseModule.forFeature([{name: Order.name, schema: OrderSchema}])],
  controllers: [DashboardController],
  providers: [DashboardService]
})
export class DashboardModule {}
