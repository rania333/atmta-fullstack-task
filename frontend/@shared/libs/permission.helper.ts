export function hasPermission(permissions: string[], permission: string) {
  return permissions.includes(permission);
}

export function hasModulePermission(permissions: string[], moduleName: string ) {
  return permissions.some((permission) =>
    permission.startsWith(`${moduleName}.`),
  );
}