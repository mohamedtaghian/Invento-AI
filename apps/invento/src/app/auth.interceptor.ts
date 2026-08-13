import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Hardcoded development token for admin access (with valid store UUID)
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMTExMTExMS0xMTExLTExMTEtMTExMS0xMTExMTExMTExMTEiLCJlbWFpbCI6ImFkbWluQGludmVudG8uY29tIiwicm9sZSI6IkFETUlOIiwic3RvcmVJZCI6IjllMDExYTYyLWRlYzEtNDM3OS05ZWIzLTQ5NWQyNDMxMzg5ZSIsImV4cCI6MzMzMjIyOTQwNDJ9.qVPjnUHc5S_BExeQfgUCTEt9bUgBC_AX2qWvu-jkItw';
  
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
  
  return next(authReq);
};
