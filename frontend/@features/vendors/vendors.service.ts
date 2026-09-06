import { apiFetch } from '@/@shared/libs/api';
import { IBaseReq, IBaseRes } from '@/@shared/libs/base-api.types';
import { buildQueryParams } from '@/@shared/libs/query-params';
import { ICreateVendorReq, IVendorRes } from './vendors.types';
import { auth } from '@/@shared/libs/auth';

export const vendorsService = {
  getVendors(params: IBaseReq = {} as IBaseReq) {
    const query = buildQueryParams({ ...params });

    return apiFetch<IBaseRes<IVendorRes[]>>(
      `/vendors?${query}`,
    );
  },
  getVendor(vendorId: number) {
    return apiFetch<IBaseRes<IVendorRes>>(
      `/vendors/${vendorId}`,
    );
  },

  createVendor(data: ICreateVendorReq) {
    return apiFetch<IBaseRes<IVendorRes>>('/vendors', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateVendor( vendorId: number, data: ICreateVendorReq ) {
    return apiFetch<IBaseRes<IVendorRes>>(`/vendors/${vendorId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  deleteVendor(vendorId: number) {
    return apiFetch<IBaseRes<IVendorRes>>(`/vendors/${vendorId}`, {
      method: 'DELETE',
    });
  },

  // Custom action
  async exportVendors(params: IBaseReq = {} as IBaseReq) {
    const query = buildQueryParams({ ... params});

    const token = auth.getToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/vendors/export?${query}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error('Failed to export vendors');
    }

    return response.blob(); // For export
  },
};