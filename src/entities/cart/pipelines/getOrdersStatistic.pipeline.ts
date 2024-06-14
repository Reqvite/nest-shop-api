import {PipelineStage} from 'mongoose';
import {dayOfWeekNames} from '@/const/dayOfWeekNames';
import {monthNames} from '@/const/monthNames';
import {Quarter} from '@/enums/quarter.enum';

const getGroup = () => {
  return {
    sales: {
      $sum: '$totalPrice'
    },
    orders: {
      $sum: 1
    }
  };
};

export const getOrdersStatisticPipeline = {
  monthly: (): PipelineStage[] => [
    {
      $group: {
        _id: {
          month: {
            $month: '$createdAt'
          }
        },
        ...getGroup()
      }
    },
    {
      $sort: {
        '_id.month': 1
      }
    },
    {
      $project: {
        _id: 0,
        name: {
          $arrayElemAt: [monthNames, {$subtract: ['$_id.month', 1]}]
        },
        sales: 1,
        orders: 1
      }
    }
  ],
  weekly: (): PipelineStage[] => [
    {
      $group: {
        _id: {$dayOfWeek: '$createdAt'},
        ...getGroup()
      }
    },
    {
      $sort: {
        _id: 1
      }
    },
    {
      $project: {
        _id: 0,
        name: {
          $arrayElemAt: [dayOfWeekNames, {$subtract: ['$_id', 1]}]
        },
        sales: 1,
        orders: 1
      }
    }
  ],
  quarterly: (): PipelineStage[] => [
    {
      $project: {
        quarter: {
          $cond: [
            {$lte: [{$month: '$createdAt'}, 3]},
            Quarter.Q1,
            {
              $cond: [
                {$lte: [{$month: '$createdAt'}, 6]},
                Quarter.Q2,
                {
                  $cond: [{$lte: [{$month: '$createdAt'}, 9]}, Quarter.Q3, Quarter.Q4]
                }
              ]
            }
          ]
        },
        ...getGroup()
      }
    },
    {
      $group: {
        _id: '$quarter',
        sales: {$sum: '$sales'},
        orders: {$sum: '$orders'}
      }
    },
    {
      $project: {
        _id: 0,
        name: '$_id',
        sales: 1,
        orders: 1
      }
    },
    {
      $sort: {
        name: 1
      }
    }
  ]
};
