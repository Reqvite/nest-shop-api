import {ObjectId} from 'mongodb';
import {PipelineStage} from 'mongoose';

export const getReviewsPipeline = (_id: string): PipelineStage[] => [
  {$sort: {createdAt: -1, _id: 1}},
  {$match: {productId: new ObjectId(_id), parentId: null}},
  {
    $lookup: {
      from: 'users',
      localField: 'userId',
      foreignField: '_id',
      as: 'user'
    }
  },
  {$unwind: '$user'},
  {
    $addFields: {
      username: {$concat: ['$user.firstName', ' ', '$user.lastName']}
    }
  },
  {
    $lookup: {
      from: 'reviews',
      localField: '_id',
      foreignField: 'parentId',
      as: 'children'
    }
  },
  {$unwind: {path: '$children', preserveNullAndEmptyArrays: true}},
  {
    $lookup: {
      from: 'users',
      localField: 'children.userId',
      foreignField: '_id',
      as: 'children.user'
    }
  },
  {$unwind: {path: '$children.user', preserveNullAndEmptyArrays: true}},
  {
    $addFields: {
      'children.username': {
        $concat: ['$children.user.firstName', ' ', '$children.user.lastName']
      }
    }
  },
  {
    $group: {
      _id: '$_id',
      productId: {$first: '$productId'},
      userId: {$first: '$userId'},
      createdAt: {$first: '$createdAt'},
      username: {$first: '$username'},
      message: {$first: '$message'},
      rating: {$first: '$rating'},
      children: {
        $push: {
          $cond: {
            if: {$and: [{$ne: ['$children._id', null]}, {$ne: ['$children._id', '$$REMOVE']}]},
            then: {
              _id: '$children._id',
              userId: '$children.userId',
              parentId: '$children.parentId',
              message: '$children.message',
              createdAt: '$children.createdAt',
              username: '$children.username'
            },
            else: '$$REMOVE'
          }
        }
      }
    }
  }
];
