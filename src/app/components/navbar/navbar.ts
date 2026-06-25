import { Directionality } from '@angular/cdk/bidi';
import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { HlmNavigationMenuImports } from '@spartan/helm/navigation-menu';

type Language = 'en' | 'ar';

interface TranslationEntry {
  dir: 'ltr' | 'rtl';
  values: Record<string, string>;
}

type Translations = Record<Language, TranslationEntry>;

@Component({
  selector: 'app-navbar',
  imports: [HlmNavigationMenuImports],
  providers: [Directionality],
  host: {
    '[dir]': '_dir()',
  },
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  readonly language = signal<Language>('en');
  readonly dir = computed(() => (this.language() === 'ar' ? 'rtl' : 'ltr'));

  private readonly _translations: Translations = {
    en: {
      dir: 'ltr',
      values: {
        gettingStarted: 'Getting started',
        introduction: 'Introduction',
        introductionDesc: 'Re-usable components built with Tailwind CSS.',
        installation: 'Installation',
        installationDesc: 'How to install dependencies and structure your app.',
        typography: 'Typography',
        typographyDesc: 'Styles for headings, paragraphs, lists...etc',
        components: 'Components',
        alertDialog: 'Alert Dialog',
        alertDialogDesc:
          'A modal dialog that interrupts the user with important content and expects a response.',
        hoverCard: 'Hover Card',
        hoverCardDesc: 'For sighted users to preview content available behind a link.',
        progress: 'Progress',
        progressDesc:
          'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
        scrollArea: 'Scroll-area',
        scrollAreaDesc: 'Visually or semantically separates content.',
        tabs: 'Tabs',
        tabsDesc:
          'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
        tooltip: 'Tooltip',
        tooltipDesc:
          'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
        withIcon: 'With Icon',
        backlog: 'Backlog',
        toDo: 'To Do',
        done: 'Done',
        docs: 'Docs',
      },
    },
    ar: {
      dir: 'rtl',
      values: {
        gettingStarted: 'البدء',
        introduction: 'مقدمة',
        introductionDesc: 'مكونات قابلة لإعادة الاستخدام مبنية باستخدام Tailwind CSS.',
        installation: 'التثبيت',
        installationDesc: 'كيفية تثبيت التبعيات وتنظيم تطبيقك.',
        typography: 'الطباعة',
        typographyDesc: 'أنماط للعناوين والفقرات والقوائم...إلخ',
        components: 'المكونات',
        alertDialog: 'حوار التنبيه',
        alertDialogDesc: 'حوار نافذة يقطع المستخدم بمحتوى مهم ويتوقع استجابة.',
        hoverCard: 'بطاقة التحويم',
        hoverCardDesc: 'للمستخدمين المبصرين لمعاينة المحتوى المتاح خلف الرابط.',
        progress: 'التقدم',
        progressDesc: 'يعرض مؤشرًا يوضح تقدم إتمام المهمة، عادةً يتم عرضه كشريط تقدم.',
        scrollArea: 'منطقة التمرير',
        scrollAreaDesc: 'يفصل المحتوى بصريًا أو دلاليًا.',
        tabs: 'التبويبات',
        tabsDesc:
          'مجموعة من أقسام المحتوى المتعددة الطبقات—المعروفة بألواح التبويب—التي يتم عرضها واحدة في كل مرة.',
        tooltip: 'تلميح',
        tooltipDesc:
          'نافذة منبثقة تعرض معلومات متعلقة بعنصر عندما يتلقى العنصر التركيز على لوحة المفاتيح أو عند تحويم الماوس فوقه.',
        withIcon: 'مع أيقونة',
        backlog: 'قائمة الانتظار',
        toDo: 'المهام',
        done: 'منجز',
        docs: 'الوثائق',
      },
    },
  };

  protected readonly _components = [
    {
      titleKey: 'alertDialog' as const,
      descriptionKey: 'alertDialogDesc' as const,
      href: '/components/alert-dialog',
    },
    {
      titleKey: 'hoverCard' as const,
      descriptionKey: 'hoverCardDesc' as const,
      href: '/components/hover-card',
    },
    {
      titleKey: 'progress' as const,
      descriptionKey: 'progressDesc' as const,
      href: '/components/progress',
    },
    {
      titleKey: 'scrollArea' as const,
      descriptionKey: 'scrollAreaDesc' as const,
      href: '/components/scroll-area',
    },
    {
      titleKey: 'tabs' as const,
      descriptionKey: 'tabsDesc' as const,
      href: '/components/tabs',
    },
    {
      titleKey: 'tooltip' as const,
      descriptionKey: 'tooltipDesc' as const,
      href: '/components/tooltip',
    },
  ];

  private readonly _translation = computed(() => this._translations[this.language()]);
  protected readonly _t = computed(() => this._translation().values);
  protected readonly _dir = computed(() => this._translation().dir);

  private readonly _directionality = inject(Directionality);

  constructor() {
    effect(() => {
      const dir = this._dir();
      untracked(() => this._directionality.valueSignal.set(dir));
    });
  }
}
