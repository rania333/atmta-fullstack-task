import { apiFetch } from "@/@shared/libs/api";
import { IBaseReq, IBaseRes } from "@/@shared/libs/base-api.types";
import { buildQueryParams } from "@/@shared/libs/query-params";
import { ICategoryRes, ICreateCategoryReq } from "./categories.types";

export const categoriesService = {
  getCategories(params: IBaseReq = {} as IBaseReq) {
    const query = buildQueryParams({ ...params });
    return apiFetch<IBaseRes<ICategoryRes[]>>(`/categories?${query}`);
  },

  getCategory(categoryId: number) {
    return apiFetch<IBaseRes<ICategoryRes>>( `/categories/${categoryId}` )
  },

  createCategory(data: ICreateCategoryReq) {
    return apiFetch('/categories', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  updateCategory(categoryId: number, data: ICreateCategoryReq) {
    return apiFetch(`/categories/${categoryId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  deleteCategory(categoryId: number) {
    return apiFetch(`/categories/${categoryId}`, {
      method: 'DELETE',
    });
  },
};

