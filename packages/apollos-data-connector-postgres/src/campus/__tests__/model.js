import { sequelize, sync } from '../../postgres/index';
import { createModel, setupModel } from '../model';
import { createModel as createPeopleModel } from '../../people/model';

describe('Campus model', () => {
  beforeEach(async () => {
    await createPeopleModel();
    await createModel();
    await setupModel();
    await sync();
  });
  afterEach(async () => {
    await sequelize.dropAllSchemas();
  });

  it('constructs without issues', async () => {
    const campus = await sequelize.models.campus.create({
      name: 'main campus',
      originType: 'rock',
      originId: '1',
    });

    let me = await sequelize.models.people.create({
      firstName: 'Vincent',
      lastName: 'Wilson',
      gender: 'MALE',
      originType: 'rock',
      originId: '1',
    });

    await me.setCampus(campus);

    me = await me.reload();

    expect(me.campusId).toBe(campus.id);
  });
});
