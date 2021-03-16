import { Op } from 'sequelize';
import { parseGlobalId } from '@apollosproject/server-core';
import { PostgresDataSource } from '../postgres';
import { Visibility } from './model';

class CommentDataSource extends PostgresDataSource {
  modelName = 'comments';

  async addComment({ text, parentId, visibility = Visibility.PUBLIC }) {
    const currentPersonId = await this.context.dataSources.Person.getCurrentPersonId();

    const { id, __type } = parseGlobalId(parentId);

    const [comment, created] = await this.model.findOrCreate({
      where: {
        text,
        externalParentId: String(id),
        externalParentType: __type,
        externalParentSource: 'rock',
        personId: currentPersonId,
      },
      defaults: {
        visibility,
      },
    });

    if (!created) {
      throw new Error(
        'Unable to save comment, a duplicate comment already exists'
      );
    }

    return comment;
  }

  async getForNode({ nodeId, nodeType, flagLimit = 0 }) {
    let currentPersonId;
    try {
      currentPersonId = await this.context.dataSources.Person.getCurrentPersonId();
    } catch {
      // no user signed in, that's fine. We'll just return an empty array.
      return [];
    }

    // select comments.*, follows.id as follow_id from comments left join follows on follows."followedPersonId" = comments."personId" and follows."requestPersonId" = '05c032d6-94a9-4e43-89c6-aa777f68d682' and follows.state = 'ACCEPTED' order by follow_id nulls last;

    const where = {
      externalParentId: String(nodeId),
      externalParentType: nodeType,
      [Op.or]: [
        { visibility: Visibility.PUBLIC }, // Show public journals
        {
          personId: currentPersonId,
        },
      ],
    };

    if (flagLimit > 0) {
      where.flagCount = { [Op.lt]: flagLimit };
    }

    const { comments, follows } = this.sequelize.models;

    return comments.findAll({
      where,
      include: [
        // we join in the follows table to sort your followers to the top
        {
          model: follows,
          where: {
            requestPersonId: currentPersonId, // we look for people who you follows
            state: 'ACCEPTED', // and make sure they are accepted
          },
          required: false, // emulates a left outer join
        },
      ],
      order: [[follows, 'id', 'desc', 'nulls last']], // and sort null (no relationship) values to the bottom
    });
  }
}

export { CommentDataSource as default };
