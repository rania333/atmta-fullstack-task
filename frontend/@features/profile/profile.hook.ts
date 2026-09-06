import { useQuery, skipToken } from "@tanstack/react-query";
import { profileService } from "./profile.service";

export function useProfileDetails(userId?: number) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: userId ? () => profileService.getProfileDetails(userId) : skipToken,
    enabled: !!userId
  });
}