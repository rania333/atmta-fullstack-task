'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { vendorsService } from './vendors.service';
import { IBaseReq } from '@/@shared/libs/base-api.types';
import { toast } from 'sonner';
import { IUpdateVendorParams } from './vendors.types';

export function useVendors(params: IBaseReq) {
  return useQuery({
    queryKey: ['vendors', params],
    queryFn: () => vendorsService.getVendors(params),
    staleTime: 60 * 1000,
  });
}

export function useVendor(vendorId: number) {
  return useQuery({
    queryKey: ['vendors', vendorId],
    queryFn: () =>
      vendorsService.getVendor(vendorId),

    enabled: !!vendorId,
    staleTime: 60 * 1000,
  });
}

export function useCreateVendor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: vendorsService.createVendor,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['vendors'],
      });

      toast.success('تم إضافة المورد بنجاح');
    },
  });
}

export function useUpdateVendor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ vendorId, data }: IUpdateVendorParams) => vendorsService.updateVendor(vendorId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['vendors'],
      });

      toast.success('تم تعديل المورد بنجاح');
    },
  });
}

export function useDeleteVendor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vendorId: number) => vendorsService.deleteVendor(vendorId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['vendors'],
      });

      toast.success('تم حذف المورد بنجاح');
    },
  });
}

export function useExportVendors() {
  return useMutation({
    mutationFn: (params: IBaseReq) =>
      vendorsService.exportVendors(params),

    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');

      link.href = url;
      link.download = 'vendors.xlsx';

      document.body.appendChild(link);
      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      toast.success('تم تصدير الموردين بنجاح');
    },
  });
}