import {ObjectId} from 'mongodb';
import {PipelineStage} from 'mongoose';

interface Query {
  [key: string]: any;
}

interface GetOrdersPipelineParams {
  skip: number;
  itemsLimit: number;
  _id: string;
  query: Query;
}

export const getOrdersPipeline = ({skip, itemsLimit, _id, query}: GetOrdersPipelineParams): PipelineStage[] => [
  {
    $facet: {
      orders: [
        {$match: {userId: new ObjectId(_id), ...query}},
        {$sort: {createdAt: -1}},
        {$skip: skip},
        {$limit: itemsLimit},
        {
          $unwind: '$products'
        },
        {
          $lookup: {
            from: 'products',
            localField: 'products._id',
            foreignField: '_id',
            as: 'fullProducts'
          }
        },
        {
          $addFields: {
            'products.fullProduct': {$arrayElemAt: ['$fullProducts', 0]},
            'products.orderedQuantity': '$products.quantity'
          }
        },
        {
          $group: {
            _id: '$_id',
            billingInfo: {$first: '$billingInfo'},
            products: {$push: '$products'},
            createdAt: {$first: '$createdAt'},
            totalPrice: {$first: '$totalPrice'}
          }
        },
        {
          $addFields: {
            products: {
              $map: {
                input: '$products',
                as: 'product',
                in: {
                  $mergeObjects: ['$$product.fullProduct', {orderedQuantity: '$$product.orderedQuantity'}]
                }
              }
            }
          }
        },
        {
          $project: {
            fullProducts: 0
          }
        }
      ],
      totalResults: [
        {$match: {userId: new ObjectId(_id), ...query}},
        {
          $group: {
            _id: null,
            count: {$sum: 1}
          }
        }
      ],
      totalOrders: [
        {$match: {userId: new ObjectId(_id), ...query}},
        {
          $count: 'total'
        }
      ]
    }
  }
];
