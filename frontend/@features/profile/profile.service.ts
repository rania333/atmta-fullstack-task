import { apiFetch } from '@/@shared/libs/api';
import { IProfileRes } from './profile.types';
import { IBaseRes } from '@/@shared/libs/base-api.types';

export const profileService = {
  getProfile(userId: number) {
    return apiFetch<IBaseRes<IProfileRes>>(`/users/${userId}`);
  },

  getProfileDetails(userId: number) {
    return apiFetch<IBaseRes<IProfileRes>>(
      `/users/${userId}/profile`,
    );
  },
};