import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model, PipelineStage} from 'mongoose';
import {TimeLine} from '@/enums/timeLine.enum';
import {GetOrdersStatisticsResponse} from '@/types/dashboard';
import {User} from '../auth/model/user.model';
import {Order} from '../cart/model/order.model';
import {getOrdersStatisticPipeline} from './pipelines/getOrdersStatistic.pipeline';

@Injectable()
export class DashboardService {
  constructor(@InjectModel(Order.name) private readonly orderModel: Model<User>) {}

  async getOrdersStatistic(timeLine = TimeLine.Week): Promise<GetOrdersStatisticsResponse['data']> {
    let pipeline: PipelineStage[];

    if (timeLine === TimeLine.Week) pipeline = getOrdersStatisticPipeline.weekly();
    if (timeLine === TimeLine.Month) pipeline = getOrdersStatisticPipeline.monthly();
    if (timeLine === TimeLine.Quarter) pipeline = getOrdersStatisticPipeline.quarterly();

    return await this.orderModel.aggregate(pipeline);
  }
}
