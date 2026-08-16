import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Hardcoded development token for admin access (with valid store UUID)
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiZWRhNjRhMC1lZTVlLTQ0NGUtODFiNC1jNjlmOTY0NjRmNmUiLCJlbWFpbCI6Im93bmVyLmxheWFsaUBpbnZlbnRvYWkudGVzdCIsInJvbGUiOiJPV05FUiIsInN0b3JlSWQiOm51bGwsImlhdCI6MTc4Njg4NDUzNiwiZXhwIjoxNzg2OTI3NzM2fQ.uOf9gaIMA5h81eElSQLhD9FVIxX2iKGV2ZixGFpRE4I';
  
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
  
  return next(authReq);
};
