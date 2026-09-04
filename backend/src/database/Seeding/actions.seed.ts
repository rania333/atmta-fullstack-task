import { Repository } from 'typeorm';
import { ACTION } from '../../@features/actions/models/actions.model.js';
import { Action } from '../../@features/actions/entities/actions.entity.js';

const actions: ACTION[] = [ACTION.CREATE, ACTION.READ, ACTION.UPDATE, ACTION.DELETE, ACTION.EXPORT];

export async function seedActions(actionRepo: Repository<Action>) {
    for (const name of actions) {
        const existingAction = await actionRepo.findOne({ where: { name }});
        if (!existingAction) {
            const action = actionRepo.create({ name });
            await actionRepo.save(action);
        }
    }
}
