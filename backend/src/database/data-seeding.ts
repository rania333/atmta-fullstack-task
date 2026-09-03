import { DataSource } from "typeorm";
import { IModule } from "./module.model.js";
import { Permission } from "../@features/permissions/entities/permission.entity.js";
import { SystemModule } from "../@features/system-modules/entities/system-module.entity.js";
import { Action } from "../@features/actions/entities/actions.entity.js";

const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: 'database.sqlite',
  entities: [Action, SystemModule, Permission],
  synchronize: true,
});

const actions: string[] = [ 'create', 'read', 'update', 'delete', 'export', 'import' ];

const modules: IModule[] = [
    { name: 'users', displayName: 'Users', actions: ['create', 'read', 'update', 'delete'] },
    { name: 'roles', displayName: 'Roles', actions: ['create', 'read', 'update', 'delete'] },
    { name: 'categories', displayName: 'Categories', actions: ['create', 'read', 'update', 'delete'] },
    { name: 'vendors', displayName: 'Vendors', actions: ['create', 'read', 'update', 'delete', 'export'] },
];

/**
 * Seeds the database with initial data
 */
async function seed() {
  await AppDataSource.initialize();

  const actionRep = AppDataSource.getRepository(Action);
  const moduleRepo = AppDataSource.getRepository(SystemModule);
  const permissionRepo = AppDataSource.getRepository(Permission);

  // Seed actions
  actions.map(async act => {
    let action = await actionRep.findOne({ where: { name: act }});
    if (!action) {
      action = actionRep.create({ name: act });
      await actionRep.save(action);
    }
  });

  // Seed modules and permissions
  modules.map(async mod => {
    let systemModule = await moduleRepo.findOne({ where: { name: mod.name }});
    if (!systemModule) {
      systemModule = moduleRepo.create({ name: mod.name, displayName: mod.displayName });
      systemModule = await moduleRepo.save(systemModule);
    }

    // check actions inside the module and create permissions for them
    mod.actions.map(async actionName => {
        const action = await actionRep.findOneByOrFail({ name: actionName });
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
    });
  });

  await AppDataSource.destroy();
}

seed()
  .then(() => {
    console.log('Seeding done');
  })
  .catch((error) => {
    console.error('Seeding failed', error);
    process.exit(1);
  });
