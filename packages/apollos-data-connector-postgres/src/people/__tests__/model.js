import { sequelize, sync } from '../../postgres/index';
import { createModel } from '../model';

describe('People model', () => {
  beforeEach(async () => {
    await createModel();
    await sync();
  });
  afterEach(async () => {
    await sequelize.dropAllSchemas();
  });

  it('constructs without issues', async () => {
    await sequelize.models.people.create({
      firstName: 'Vincent',
      lastName: 'Wilson',
      gender: 'MALE',
      originType: 'rock',
      originId: '1',
    });

    const me = await sequelize.models.people.findOne();

    expect(me.firstName).toBe('Vincent');
    expect(me.createdAt).toBeInstanceOf(Date);
    expect(me.id).toBe(1);
  });
});
