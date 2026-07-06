import { authGuard } from './guards/auth.guard';
import { routes } from './app.routes';

describe('app routes', () => {
  it('should expose the assistant route for authenticated users', () => {
    const route = routes.find(item => item.path === 'assistant');

    expect(route).toBeTruthy();
    expect(route?.canActivate).toEqual([authGuard]);
    expect(route?.loadComponent).toBeTruthy();
  });
});
