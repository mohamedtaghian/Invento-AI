import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PreviewDataClient } from './preview-data-client';
import { BuilderState } from '@/app/features/builder/services/builder-state';
import { ThemeApiResponse } from '@/app/core/interface/Preview';

describe('PreviewDataClient', () => {
  let service: PreviewDataClient;
  let httpMock: HttpTestingController;
  let builderState: BuilderState;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PreviewDataClient, BuilderState],
    });

    service = TestBed.inject(PreviewDataClient);
    httpMock = TestBed.inject(HttpTestingController);
    builderState = TestBed.inject(BuilderState);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('sets isLoading to true then false on loadThemes', () => {
    service.loadThemes();
    expect(service.isLoading()).toBe(true);

    const req = httpMock.expectOne('/generate-theme');
    req.flush({
      rawCss: ':root { --primary: #000; }',
      name: 'Test',
      description: '',
      basePreset: 'test',
    });
    expect(service.isLoading()).toBe(false);
  });

  it('uses user data from BuilderState when available', () => {
    builderState.brainstorm.set('A business about cool sneakers for urban youth.');
    builderState.aiAnswers.set({
      business_type: 'E-Commerce (Physical)',
      target: 'Millennials',
    });

    service.loadThemes();
    const req = httpMock.expectOne('/generate-theme');
    const body = req.request.body as { text: string };
    expect(body.text).toContain('cool sneakers');
    expect(body.text).toContain('Millennials');
    req.flush({
      rawCss: ':root { --primary: #000; }',
      name: 'Test',
      description: '',
      basePreset: 'test',
    });
  });

  it('falls back to default prompt when no user data', () => {
    service.loadThemes();
    const req = httpMock.expectOne('/generate-theme');
    const body = req.request.body as { text: string };
    expect(body.text).toContain('Create a modern portfolio website');
    req.flush({
      rawCss: ':root { --primary: #000; }',
      name: 'Test',
      description: '',
      basePreset: 'test',
    });
  });

  it('sets themeError on HTTP error and preserves mock themes', () => {
    service.loadThemes();
    const req = httpMock.expectOne('/generate-theme');
    req.flush('Network error', { status: 500, statusText: 'Server Error' });

    expect(service.themeError()).toBeTruthy();
    expect(service.themeSuggestions().length).toBeGreaterThan(0);
  });

  it('sets themeError when response has no rawCss', () => {
    service.loadThemes();
    const req = httpMock.expectOne('/generate-theme');
    req.flush({ name: 'Empty' } as ThemeApiResponse);

    expect(service.themeError()).toBe('Theme generation returned no data.');
  });

  it('sets _loaded flag and skips second call', () => {
    service.loadThemes();
    const req = httpMock.expectOne('/generate-theme');
    req.flush({
      rawCss: ':root { --primary: #000; }',
      name: 'Test',
      description: '',
      basePreset: 'test',
    });

    service.loadThemes();
    httpMock.expectNone('/generate-theme');
  });
});
