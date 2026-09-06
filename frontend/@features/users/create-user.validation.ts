import type { ICreateUserReq } from './users.types';

export function validateCreateUser(data: ICreateUserReq) {
  const errors: Partial<Record<keyof ICreateUserReq, string>> = {};

  if (!data.name.trim()) errors.name = 'اسم المستخدم مطلوب';
  if (!data.email.trim()) {
    errors.email = 'البريد الإلكتروني مطلوب';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = 'أدخل بريدًا إلكترونيًا صحيحًا';
  }
  if (!data.password.trim()) {
    errors.password = 'كلمة المرور مطلوبة';
  } else if (data.password.length < 8) {
    errors.password = 'كلمة المرور يجب أن تكون ٨ أحرف على الأقل';
  }
  if (!data.phone.trim()) errors.phone = 'رقم الهاتف مطلوب';
  if (!data.roleIds.length) errors.roleIds = 'اختر دورًا واحدًا على الأقل';

  return errors;
}
