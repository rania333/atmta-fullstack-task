import { IBaseReq } from "@/@shared/libs/base-api.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoriesService } from "./categories.service";
import { toast } from "sonner";
import { IUpdateCategoryParams } from "./categories.types";

export function useCategories(params: IBaseReq ) {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => categoriesService.getCategories(params),
    staleTime: 60 * 1000,
  });
}

export function useCategory(categoryId: number) {
  return useQuery({
    queryKey: ['categories', categoryId],
    queryFn: () => categoriesService.getCategory(categoryId),

    enabled: !!categoryId,
    staleTime: 60 * 1000,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoriesService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['categories'],
      });
      toast.success('تم إضافة التصنيف بنجاح');
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ categoryId, data }: IUpdateCategoryParams) => categoriesService.updateCategory(categoryId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['categories'],
      });

      toast.success('تم تعديل التصنيف بنجاح');
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: number) =>
      categoriesService.deleteCategory(categoryId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['categories'],
      });

      toast.success('تم حذف التصنيف بنجاح');
    },
  });
}