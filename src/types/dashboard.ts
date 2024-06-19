import {ApiProperty} from '@nestjs/swagger';
import {TimeLine} from '@/enums/timeLine.enum';

interface StatisticI {
  orders: number;
  sales: number;
  indexBy: string;
  month?: string;
  quarter?: string;
  week?: string;
}

export class GetOrdersStatisticQueryParamsI {
  @ApiProperty({
    example: TimeLine.Quarter
  })
  timeline: TimeLine;
}

export class GetOrdersStatisticsResponse {
  @ApiProperty({
    example: [
      {
        orders: 200,
        sales: 1324.44,
        month: 'June',
        indexBy: 'month'
      }
    ]
  })
  data: StatisticI[];
}
