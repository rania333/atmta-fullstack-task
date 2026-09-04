import { Repository } from 'typeorm';
import { Permission } from '../../@features/permissions/entities/permission.entity.js';
import { SystemModule } from '../../@features/system-modules/entities/system-module.entity.js';
import { modulesSeedData } from './modules.seed.js';
import { Action } from '../../@features/actions/entities/actions.entity.js';

// Module + Action => Permission
export async function seedPermissions( permissionRepo: Repository<Permission>, actionRepo: Repository<Action>, moduleRepo: Repository<SystemModule>) {
    for (const mod of modulesSeedData) {
        const systemModule = await moduleRepo.findOneByOrFail({ name: mod.name });
        for (const name of mod.actions) {
            const action = await actionRepo.findOneByOrFail({ name });
            const existingPermission = await permissionRepo.findOne({
                where: {
                    module: { id: systemModule.id },
                    action: { id: action.id },
                },
            });
            if (!existingPermission) {
                const permission = permissionRepo.create({
                    module: systemModule,
                    action,
                });

                await permissionRepo.save(permission);
            }
        }
    }
}
