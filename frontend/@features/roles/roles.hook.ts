'use client';

import { useQuery } from '@tanstack/react-query';
import { rolesService } from './roles.service';

export function useRoles() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: rolesService.getRoles,
    staleTime: 60 * 1000,
  });
}