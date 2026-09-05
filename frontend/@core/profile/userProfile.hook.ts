'use client';

import { profileService } from '@/@features/profile/profile.service';
import { useQuery } from '@tanstack/react-query';

export function useProfile(userId: number) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => profileService.getProfile(userId),
    enabled: !!userId
  });
}