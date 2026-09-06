'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { rolesService } from './roles.service';
import { toast } from 'sonner';
import { IUpdateRoleVariables } from './roles.types';

export function useRoles() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: rolesService.getRoles,
    staleTime: 60 * 1000,
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roleId: number) =>
      rolesService.deleteRole(roleId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['roles'],
      });

      toast.success('تم حذف الدور بنجاح');
    },
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rolesService.createRole,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['roles'],
      });

      toast.success('تم إضافة الدور بنجاح');
    },
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roleId, data }: IUpdateRoleVariables) =>
      rolesService.updateRole(roleId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['roles'],
      });

      toast.success('تم تحديث الدور بنجاح');
    },
  });
}