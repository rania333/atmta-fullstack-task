'use client';

import { useQuery } from '@tanstack/react-query';
import { usersService } from './users.service';
import { IBaseReq } from '@/@shared/libs/base-api.types';

export function useUsers(params: IBaseReq) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => usersService.getUsers(params),
    staleTime: 60 * 1000,
  });
}
