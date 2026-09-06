'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersService } from './users.service';
import { IBaseReq } from '@/@shared/libs/base-api.types';
import { IUpdateUserParams, IUpdateUserStatusReq } from './users.types';
import { toast } from 'sonner';

export function useUsers(params: IBaseReq) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => usersService.getUsers(params),
    staleTime: 60 * 1000,
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, isActive}: IUpdateUserStatusReq) =>
      usersService.updateStatus(userId, isActive),

      onSuccess: (_, vars) => {
        queryClient.invalidateQueries({
          queryKey: ['users'], // Remove all cache that starts with users
        });

        toast.success(vars.isActive ? 'تم تفعيل المستخدم بنجاح' : 'تم تعطيل المستخدم بنجاح');
      },
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersService.createUser,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users'],
      });

      toast.success('تم إضافة المستخدم بنجاح');
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: IUpdateUserParams) => usersService.updateUser(userId, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['users'],
      });

      queryClient.invalidateQueries({
        queryKey: ['users', variables.userId],
      });

      toast.success(
        'تم تعديل المستخدم بنجاح',
      );
    },
  });
}

export function useUser(userId?: number) {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: () => usersService.getUser(userId!),
    enabled: !!userId,
  });
}


