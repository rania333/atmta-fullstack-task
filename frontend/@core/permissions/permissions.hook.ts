'use client';

import { useQuery } from '@tanstack/react-query';
import { permissionsService } from './permissions.service';

export function usePermissions() {
  return useQuery({
    queryKey: ['permissions'],
    queryFn: permissionsService.getPermissions,
    staleTime: 60 * 1000,
  });
}