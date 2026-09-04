import { Repository } from "typeorm";
import { ACTION } from "../../@features/actions/models/actions.model.js";
import type { IModule } from "../../@features/system-modules/models/modules.model.js";
import { SystemModule } from '../../@features/system-modules/entities/system-module.entity.js';

const modules: IModule[] = [
    { name: 'users', displayName: 'Users', actions: [ACTION.CREATE, ACTION.READ, ACTION.UPDATE, ACTION.DELETE] },
    { name: 'roles', displayName: 'Roles', actions: [ACTION.CREATE, ACTION.READ, ACTION.UPDATE, ACTION.DELETE] },
    { name: 'categories', displayName: 'Categories', actions: [ACTION.CREATE, ACTION.READ, ACTION.UPDATE, ACTION.DELETE] },
    { name: 'vendors', displayName: 'Vendors', actions: [ACTION.CREATE, ACTION.READ, ACTION.UPDATE, ACTION.DELETE, ACTION.EXPORT] },
];

export async function seedModules(moduleRepo: Repository<SystemModule>) {
    for (const mod of modules) {
        const existingModule = await moduleRepo.findOne({ where: { name: mod.name }});
        if (!existingModule) {
            const module = moduleRepo.create({ name: mod.name, displayName: mod.displayName });
            await moduleRepo.save(module);
        }
    }

}

export { modules as modulesSeedData };
