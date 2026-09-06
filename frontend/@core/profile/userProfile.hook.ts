'use client';

import { profileService } from '@/@features/profile/profile.service';
import { skipToken, useQuery } from '@tanstack/react-query';

export function useProfile(userId?: number) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: userId ? () => profileService.getProfile(userId) : skipToken,
    enabled: !!userId
  });
}
